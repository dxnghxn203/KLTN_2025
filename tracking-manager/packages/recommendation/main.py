import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split

products = pd.DataFrame([
    {"product_id": "P1", "name": "NutriGrow Nutrimed", "category": "Bổ sung Canxi & Vitamin D", "description": "Bổ sung canxi, vitamin D3, vitamin K2, giúp tăng cường hấp thu canxi."},
    {"product_id": "P2", "name": "Vitamin D3 1000IU", "category": "Vitamin & Khoáng chất", "description": "Hỗ trợ hấp thu canxi, giúp xương chắc khỏe."},
    {"product_id": "P3", "name": "Collagen + Canxi", "category": "Hỗ trợ xương khớp", "description": "Collagen kết hợp canxi giúp bảo vệ xương và da."}
])

tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(products['description'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def get_content_based_recommendations(product_id, top_n=2):
    idx = products[products['product_id'] == product_id].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    product_indices = [i[0] for i in sim_scores]
    return products.iloc[product_indices][['product_id', 'name']]

# 3️⃣ Collaborative Filtering (Dựa trên hành vi mua hàng)
ratings_dict = {"user_id": [1, 1, 2, 2, 3, 3], "product_id": ["P1", "P2", "P1", "P3", "P2", "P3"], "rating": [5, 4, 5, 3, 4, 5]}
ratings = pd.DataFrame(ratings_dict)

reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(ratings[['user_id', 'product_id', 'rating']], reader)
trainset, testset = train_test_split(data, test_size=0.2)

model = SVD()
model.fit(trainset)

def get_collaborative_recommendations(user_id, top_n=2):
    product_ids = products['product_id'].unique()
    predictions = [model.predict(user_id, pid).est for pid in product_ids]
    top_products = np.argsort(predictions)[-top_n:][::-1]
    return products.iloc[top_products][['product_id', 'name']]

# 4️⃣ Non-Personalized Recommendations (Gợi ý phổ biến nhất)
def get_popular_recommendations(top_n=2):
    popular_products = ratings.groupby('product_id').size().sort_values(ascending=False).index[:top_n]
    return products[products['product_id'].isin(popular_products)][['product_id', 'name']]

# 5️⃣ Hybrid Recommendation
def get_hybrid_recommendations(user_id, product_id, top_n=2):
    content_recs = get_content_based_recommendations(product_id, top_n)
    collab_recs = get_collaborative_recommendations(user_id, top_n)
    popular_recs = get_popular_recommendations(top_n)
    hybrid_recs = pd.concat([content_recs, collab_recs, popular_recs]).drop_duplicates().head(top_n)
    return hybrid_recs

# 🔥 Thử nghiệm hệ thống gợi ý
print("Gợi ý dựa trên nội dung:")
print(get_content_based_recommendations("P1"))

print("\nGợi ý dựa trên hành vi người dùng:")
print(get_collaborative_recommendations(1))

print("\nGợi ý sản phẩm phổ biến:")
print(get_popular_recommendations())

print("\nGợi ý kết hợp (Hybrid):")
print(get_hybrid_recommendations(1, "P1"))
