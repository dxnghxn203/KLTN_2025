import json
from models.product import get_all_products
import re
from core.mongo import db

products_collection = db['products']

def clean_text(text):
    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text.strip()

def create_training_examples(products):
    training_examples = []
    for product in products:
        ingredients_text = ", ".join([ing["ingredient_name"] + " " + ing["ingredient_amount"] for ing in product.get("ingredients", [])])
        text = f"Thuốc {product['name_primary']} dùng để {product['uses']}. Thành phần gồm {ingredients_text}. {product['description']}. {product['full_descriptions']}. Tác dụng phụ: {product['side_effects']}. Cách dùng: {product['dosage']}. Lưu ý: {product['precautions']}"
        text = clean_text(text)
        training_examples.append(text)
    return training_examples

def save_training_examples(training_examples, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        for example in training_examples:
            f.write(example + "\n")


if __name__ == "__main__":
    products = get_all_products()
    training_examples = create_training_examples(products)
    output_file = "./prepared_medications.txt"
    save_training_examples(training_examples, output_file)