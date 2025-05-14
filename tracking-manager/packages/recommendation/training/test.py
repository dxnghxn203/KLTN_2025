import torch
from transformers import AutoConfig, RobertaForMaskedLM, AutoTokenizer
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import chain
import os

# Load OpenAI API key and base URL from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables.")

llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    model_name="gpt-4o-mini",  # Or model you are using
    base_url=OPENAI_BASE_URL,
)

# Check CUDA availability
print(f"CUDA Available: {torch.cuda.is_available()}")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")  # Define the device
print(f"Using device: {device}")

# Load PhoBERT model and tokenizer
MODEL_NAME = "vinai/phobert-base"  # Or the original model name if you fine-tuned from it
FINE_TUNED_MODEL_PATH = os.path.abspath("./training/trained_model")  # Get the absolute path

# Explicitly load the tokenizer and model
try:
    # Load configuration
    config = AutoConfig.from_pretrained(FINE_TUNED_MODEL_PATH)

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(FINE_TUNED_MODEL_PATH)

    # Load model and move to device
    phobert_model = RobertaForMaskedLM.from_pretrained(
        FINE_TUNED_MODEL_PATH,
        config=config
    ).to(device)


    print("PhoBERT model loaded successfully.")

except Exception as e:
    print(f"Error loading PhoBERT model: {e}")
    raise  # Re-raise the exception to stop execution


# Define Embedding model
phobert_embeddings = HuggingFaceEmbeddings(model_name=MODEL_NAME)

# Define Prompt
prompt_template = """You are a helpful assistant. Use the following context to answer the query. If you don't know the answer, just say that you don't know.

Context: {context}

Query: {query}

Answer:"""
prompt = PromptTemplate.from_template(prompt_template)

# Create LLM chain using the RunnableSequence
llm_chain = prompt | llm


def generate_answer(query, text):
    """
    Generates an answer to a query based on the given Vietnamese text, using PhoBERT for embedding and GPT-4 for generation.
    """
    context = phobert_embeddings.embed_documents([text])[0]  # Embed the document
    answer = llm_chain.invoke({"context": context, "query": query})
    return answer


# Example usage
vietnamese_text = "Thuốc này dùng để điều trị bệnh gì?"
query = "Công dụng của thuốc này là gì?"
answer = generate_answer(query, vietnamese_text)
print(answer)