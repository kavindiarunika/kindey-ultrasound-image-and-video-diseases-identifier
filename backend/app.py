from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image

app = Flask(__name__)
CORS(app)  # This allows your React app to talk to Flask

# ✅ Load your YOLO model once when the server starts
# Make sure your .pth/.pt file is in the same folder as app.py
model = YOLO("cnn_rnn_tumor_classifier.pt")  # 👈 Change this to your actual filename

# ✅ Class labels — must match the order your model was trained with
CLASS_NAMES = ["Cyst", "Normal", "Stone", "Tumor"]


@app.route("/api/analyze", methods=["POST"])
def analyze():
    # --- 1. Check that an image was actually sent ---
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]

    # --- 2. Open the image with Pillow ---
    try:
        image = Image.open(file.stream).convert("RGB")
    except Exception:
        return jsonify({"error": "Invalid image file"}), 400

    # --- 3. Run YOLO inference ---
    results = model(image)[0]  # [0] because we only sent one image

    # --- 4. Build a clean list of detections ---
    detections = []
    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()   # bounding box coordinates
        confidence = float(box.conf[0])            # confidence score 0-1
        class_index = int(box.cls[0])             # class index

        detections.append({
            "label": CLASS_NAMES[class_index],
            "confidence": round(confidence * 100, 2),  # as percentage
            "box": {
                "x1": round(x1, 2),
                "y1": round(y1, 2),
                "x2": round(x2, 2),
                "y2": round(y2, 2),
            }
        })

    # --- 5. Sort by confidence (highest first) ---
    detections.sort(key=lambda d: d["confidence"], reverse=True)

    return jsonify({
        "success": True,
        "detections": detections,
        "total_found": len(detections)
    })


# Simple health check — visit http://localhost:5000/api/health to confirm it's running
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "running"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)