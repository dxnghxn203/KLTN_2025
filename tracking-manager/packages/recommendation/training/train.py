from transformers import AutoTokenizer, AutoModelForMaskedLM, Trainer, TrainingArguments
from datasets import load_dataset
import torch

MODEL_NAME = "vinai/phobert-base"
DATA_FILE = "./prepared_medications.txt"
OUTPUT_DIR = "./trained_model"

class CustomTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
        labels = inputs.get("labels")
        # Remove special_tokens_mask from inputs
        inputs.pop("special_tokens_mask", None)
        # forward pass
        outputs = model(**inputs)
        logits = outputs.get("logits")
        # compute loss
        loss_fct = torch.nn.CrossEntropyLoss()
        loss = loss_fct(logits.view(-1, self.model.config.vocab_size), labels.view(-1))
        return (loss, outputs) if return_outputs else loss


def main():
    # Check if CUDA (GPU) is available
    if torch.cuda.is_available():
        device = torch.device("cuda")
        print("CUDA is available. Training will be performed on GPU.")
    else:
        device = torch.device("cpu")
        print("CUDA is not available. Training will be performed on CPU.")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForMaskedLM.from_pretrained(MODEL_NAME).to(device) # Move the model to the GPU

    dataset = load_dataset("text", data_files=DATA_FILE)

    def tokenize_function(examples):
        outputs = tokenizer(examples["text"], truncation=True, padding="max_length", max_length=128, return_special_tokens_mask=True)
        return {"labels": outputs["input_ids"], **outputs}

    tokenized_datasets = dataset.map(tokenize_function, batched=True, num_proc=4, remove_columns=["text"])

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        overwrite_output_dir=True,
        num_train_epochs=3,
        per_device_train_batch_size=16,
        save_steps=1000,
        save_total_limit=2,
        prediction_loss_only=False,
        report_to="none",
        remove_unused_columns=False,
        fp16=True, # Enable mixed precision training for faster and less memory intensive training if your GPU supports it
    )

    trainer = CustomTrainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets["train"],
        tokenizer=tokenizer,
    )

    trainer.train()
    trainer.save_model(OUTPUT_DIR)

if __name__ == "__main__":
    main()