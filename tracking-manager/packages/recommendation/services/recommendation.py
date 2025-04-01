import os

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split

from core import logger
from core.redis import redis_client
from models.order import get_all_order
from models.product import get_all_product
from models.review import get_all_review


class RecommendationSystem:
    def __init__(self):
        self.model = None
        self.cosine_sim = None
        self.tfidf = None
        self.products = None
        self.reviews = None
        self.orders = None
        self.tfidf_matrix = None
        self.retrain_model()

    def retrain_model(self):
        self.products = pd.DataFrame( get_all_product())
        self.reviews = pd.DataFrame( get_all_review())
        self.orders = pd.DataFrame(get_all_order())
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(self.products['description'])
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        self.model = self.train_collaborative_model()

    def get_top_selling_products(self, top_n=5):
        exploded_orders = self.orders.explode('product')
        data_product = self.products
        exploded_orders['product_id'] = exploded_orders['product'].apply(
            lambda x: x.get('product_id') if isinstance(x, dict) else None)
        top_products = exploded_orders.groupby('product_id').size().sort_values(ascending=False).head(top_n)
        result = self.products[self.products['product_id'].isin(top_products.index)]

        if len(result) < top_n:
            additional_products = data_product[
                ~data_product['product_id'].isin(result['product_id'])].drop_duplicates('product_id').head(
                top_n - len(result))
            result = pd.concat([result, additional_products])

        return result.drop_duplicates('product_id').head(top_n)

    def get_recently_viewed(self, identifier):
        key = f"recently_viewed:{identifier}"
        product_ids = redis_client.lrange(key, 0, -1)
        return self.products[self.products['product_id'].isin(product_ids)]

    def get_featured_products(self, main_category_id, sub_category_id=None, child_category_id=None,  top_n=5):
        exploded_orders = self.orders.explode('product')
        data_product = self.products
        exploded_orders['product_id'] = exploded_orders['product'].apply(
            lambda x: x.get('product_id') if isinstance(x, dict) else None)
        exploded_orders = exploded_orders.dropna(subset=['product_id'])
        product_categories = data_product.set_index('product_id')['category'].to_dict()
        exploded_orders['category'] = exploded_orders['product_id'].map(product_categories)
        exploded_orders = exploded_orders[exploded_orders['category'].apply(lambda x: isinstance(x, dict))]

        filtered_orders = exploded_orders[exploded_orders['category'].apply(lambda x: (
                (main_category_id is None or x.get('main_category_id') == main_category_id) and
                (child_category_id is None or x.get('child_category_id') == child_category_id) and
                (sub_category_id is None or x.get('sub_category_id') == sub_category_id)
        ))]

        category_products = filtered_orders.groupby('product_id').size().sort_values(ascending=False).head(top_n)
        result = data_product[data_product['product_id'].isin(category_products.index)]
        if len(result) < top_n:
            additional_products = data_product[data_product['category'].apply(lambda x: (
                    (main_category_id is None or x.get('main_category_id') == main_category_id) and
                    (child_category_id is None or x.get('child_category_id') == child_category_id) and
                    (sub_category_id is None or x.get('sub_category_id') == sub_category_id)
            ))].head(top_n - len(result))
            result = pd.concat([result, additional_products])

        return result.drop_duplicates('product_id').head(top_n)

    def get_related_products(self, product_id, top_n=5):
        idx = self.products[self.products['product_id'] == product_id].index[0]
        sim_scores = sorted(enumerate(self.cosine_sim[idx]), key=lambda x: x[1], reverse=True)[1:top_n + 1]
        product_indices = [i[0] for i in sim_scores]
        return self.products.iloc[product_indices]

    def train_collaborative_model(self):
        exploded_orders = self.orders.explode('product')
        exploded_orders['product_id'] = exploded_orders['product'].apply(
            lambda x: x.get('product_id') if isinstance(x, dict) else None)

        review_ratings = self.reviews[['user_id', 'product_id', 'rating']]
        order_ratings = exploded_orders[['created_by', 'product_id']].dropna()
        order_ratings.rename(columns={'created_by': 'user_id'}, inplace=True)
        order_ratings['rating'] = 1  # Default rating for purchases

        ratings = pd.concat([order_ratings, review_ratings]).drop_duplicates()

        if ratings.empty:
            return None

        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(ratings[['user_id', 'product_id', 'rating']], reader)
        trainset, _ = train_test_split(data, test_size=0.2)
        model = SVD()
        model.fit(trainset)
        return model

    def get_collaborative_recommendations(self, created_by, top_n=5):
        if pd.isna(created_by) or self.model is None:
            return []

        product_ids = self.products['product_id'].unique()
        predictions = [self.model.predict(created_by, pid).est for pid in product_ids]
        top_products = np.argsort(predictions)[-top_n:][::-1]
        return self.products.iloc[top_products]

# if __name__ == "__main__":
#     recommender = RecommendationSystem()
#     print("Bán chạy:", recommender.get_top_selling_products())
#     print("Vừa xem:", recommender.get_recently_viewed(1))
#     print("Nổi bật trong danh mục A:", recommender.get_featured_products("Vitamin & Khoáng chất"))
#     print("Sản phẩm liên quan:", recommender.get_related_products("P1"))
#     print("Gợi ý từ hành vi:", recommender.get_collaborative_recommendations(1))
