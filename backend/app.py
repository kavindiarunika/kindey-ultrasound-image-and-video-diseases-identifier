from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_image
import os

app = Flask(__name__)
CORS(app)  # Allows React frontend to call this API

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint — useful to verify the server is running."""
    return jsonify({"status": "ok", "message": "Kidney disease detection API is running."})


@app.route("/predict", methods=["POST"])
def predict():
    """
    Accepts a kidney ultrasound image and returns:
      - predicted class label
      - confidence score
      - all class probabilities (optional, useful for UI charts)
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided. Send it as form-data with key 'image'."}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": f"Unsupported file type. Allowed: {ALLOWED_EXTENSIONS}"}), 415

    try:
        image_bytes = file.read()
        result = predict_image(image_bytes)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)