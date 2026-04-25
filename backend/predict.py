from PIL import Image
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from ultralytics import YOLO
import io
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "cnn_rnn_tumor_classifier.pth")
CLASS_NAMES = ["cyst", "normal", "stone", "tumor"]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Using device: {device}")

image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

print(f"[INFO] Loading model from: {MODEL_PATH}")
try:
    try:
        model = YOLO(MODEL_PATH)
        model_type = "yolo"
        print("[INFO] Model loaded as YOLO.")
    except:
        model = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
        model_type = "pytorch"
        print("[INFO] Model loaded as PyTorch.")
    print("[INFO] Model loaded successfully.")
except Exception as e:
    print(f"[ERROR] Failed to load model: {str(e)}")
    model = None
    model_type = None


def predict_image(image_bytes: bytes) -> dict:
    """
    Run classification inference on raw image bytes.
    Supports both YOLO and PyTorch models.

    Args:
        image_bytes: Raw bytes of the uploaded image file.

    Returns:
        dict with keys:
          - predicted_class (str)
          - confidence (float, 0-100)
          - all_probabilities (dict: class_name -> confidence %)
    """
    if model is None:
        raise Exception("Model failed to load. Check the model path and file.")
    
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        if model_type == "yolo":
            results = model(image, verbose=False)
            result = results[0]
            
            top_class_index = int(result.probs.top1)
            top_confidence = float(result.probs.top1conf) * 100
            predicted_class = CLASS_NAMES[top_class_index]
            
            all_probs = {
                CLASS_NAMES[i]: round(float(prob) * 100, 2)
                for i, prob in enumerate(result.probs.data.tolist())
            }
        else:
            image_tensor = image_transform(image).unsqueeze(0).to("cpu")
            
            with torch.no_grad():
                outputs = model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
            
            top_confidence, top_class_index = torch.max(probabilities, 1)
            top_class_index = int(top_class_index.item())
            top_confidence = float(top_confidence.item()) * 100
            
            predicted_class = CLASS_NAMES[top_class_index]
            
            all_probs = {
                CLASS_NAMES[i]: round(float(prob) * 100, 2)
                for i, prob in enumerate(probabilities[0].cpu().numpy())
            }
        
        return {
            "predicted_class": predicted_class,
            "confidence": round(top_confidence, 2),
            "all_probabilities": all_probs,
        }
    
    except Exception as e:
        raise Exception(f"Error during prediction: {str(e)}")