from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import cv2
import tempfile
import os
import io
import base64

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────
# ESRGAN ARCHITECTURE (no basicsr needed)
# ─────────────────────────────────────────────
class ResidualDenseBlock(nn.Module):
    def __init__(self, num_feat=64, num_grow_ch=32):
        super().__init__()
        self.conv1 = nn.Conv2d(num_feat, num_grow_ch, 3, 1, 1)
        self.conv2 = nn.Conv2d(num_feat + num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv3 = nn.Conv2d(num_feat + 2 * num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv4 = nn.Conv2d(num_feat + 3 * num_grow_ch, num_grow_ch, 3, 1, 1)
        self.conv5 = nn.Conv2d(num_feat + 4 * num_grow_ch, num_feat, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

    def forward(self, x):
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    def __init__(self, num_feat, num_grow_ch=32):
        super().__init__()
        self.rdb1 = ResidualDenseBlock(num_feat, num_grow_ch)
        self.rdb2 = ResidualDenseBlock(num_feat, num_grow_ch)
        self.rdb3 = ResidualDenseBlock(num_feat, num_grow_ch)

    def forward(self, x):
        out = self.rdb1(x)
        out = self.rdb2(out)
        out = self.rdb3(out)
        return out * 0.2 + x


class RRDBNet(nn.Module):
    def __init__(self, num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32):
        super().__init__()
        self.conv_first = nn.Conv2d(num_in_ch, num_feat, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(num_feat, num_grow_ch) for _ in range(num_block)])
        self.conv_body = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_hr = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_last = nn.Conv2d(num_feat, num_out_ch, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

    def forward(self, x):
        feat = self.conv_first(x)
        body_feat = self.conv_body(self.body(feat))
        feat = feat + body_feat
        feat = self.lrelu(self.conv_up1(F.interpolate(feat, scale_factor=2, mode='nearest')))
        feat = self.lrelu(self.conv_up2(F.interpolate(feat, scale_factor=2, mode='nearest')))
        return self.conv_last(self.lrelu(self.conv_hr(feat)))


# ─────────────────────────────────────────────
# LOAD MODELS (once at startup)
# ─────────────────────────────────────────────
yolo_model = YOLO("cnn_rnn_tumor_classifier.pt")

def load_esrgan(path="esrgan.pth"):
    try:
        model = RRDBNet()

        if not os.path.exists(path):
            print(f"⚠️  ESRGAN model not found at {path}. Enhancement will be disabled.")
            return None

        raw = torch.load(path, map_location="cpu")
        print(f"✓ Loaded checkpoint with keys: {list(raw.keys())[:5]}...")

        mapping = {
            "RRDB_trunk":  "body",
            ".RDB1.":      ".rdb1.",
            ".RDB2.":      ".rdb2.",
            ".RDB3.":      ".rdb3.",
            "trunk_conv":  "conv_body",
            "upconv1":     "conv_up1",
            "upconv2":     "conv_up2",
            "HRconv":      "conv_hr",
        }

        new_state = {}
        for k, v in raw.items():
            new_k = k
            for old, new in mapping.items():
                new_k = new_k.replace(old, new)
            new_state[new_k] = v

        try:
            model.load_state_dict(new_state, strict=True)
            print("✓ ESRGAN model loaded successfully (strict mode)")
        except RuntimeError as e:
            print(f"⚠️  Strict loading failed, trying non-strict...")
            model.load_state_dict(new_state, strict=False)
            print("✓ ESRGAN model loaded (non-strict mode)")

        model.eval()
        return model

    except Exception as e:
        print(f"❌ Failed to load ESRGAN: {e}")
        return None

esrgan_model = load_esrgan("esrgan.pth")

CLASS_NAMES = ["Cyst", "Normal", "Stone", "Tumor"]

TARGET_SIZE = (800, 800)  # ✅ fixed output resolution for enhanced images


# ─────────────────────────────────────────────
# ESRGAN HELPER
# ─────────────────────────────────────────────
def enhance(pil_image):
    if esrgan_model is None:
        return pil_image
    try:
        img = np.array(pil_image).astype(np.float32) / 255.0
        tensor = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0)
        with torch.no_grad():
            output = esrgan_model(tensor)
        output = output.squeeze(0).permute(1, 2, 0).clamp(0, 1).numpy()
        enhanced = Image.fromarray((output * 255).astype(np.uint8))

        # ✅ Resize to exactly 800x800 after ESRGAN
        enhanced = enhanced.resize(TARGET_SIZE, Image.LANCZOS)
        return enhanced
    except Exception as e:
        print(f"❌ ESRGAN error: {e}")
        return pil_image


# ─────────────────────────────────────────────
# YOLO HELPER
# ─────────────────────────────────────────────
def detect(pil_image):
    results = yolo_model(pil_image)[0]
    detections = []
    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        confidence = float(box.conf[0])
        class_index = int(box.cls[0])
        detections.append({
            "label": CLASS_NAMES[class_index],
            "confidence": round(confidence * 100, 2),
            "box": {
                "x1": round(x1, 2), "y1": round(y1, 2),
                "x2": round(x2, 2), "y2": round(y2, 2),
            }
        })
    detections.sort(key=lambda d: d["confidence"], reverse=True)
    return detections


# ─────────────────────────────────────────────
# IMAGE ANALYSIS
# ─────────────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def analyze_image():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    use_esrgan = request.form.get("enhance", "false").lower() == "true"

    try:
        image = Image.open(file.stream).convert("RGB")
    except Exception:
        return jsonify({"error": "Invalid image file"}), 400

    # Capture original resolution
    original_w, original_h = image.size

    enhanced_b64 = None
    enhanced_w, enhanced_h = None, None

    if use_esrgan:
        image = enhance(image)
        enhanced_w, enhanced_h = image.size   # will be 800x800

        # Convert enhanced image → base64 to send to frontend
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=95)
        enhanced_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    detections = detect(image)

    return jsonify({
        "success": True,
        "enhanced": use_esrgan,
        "enhanced_image": enhanced_b64,        # base64 string or null
        "resolution": {
            "original": f"{original_w}x{original_h}",
            "enhanced": f"{enhanced_w}x{enhanced_h}" if use_esrgan else None,
        },
        "detections": detections,
        "total_found": len(detections)
    })


# ─────────────────────────────────────────────
# VIDEO ANALYSIS
# ─────────────────────────────────────────────
@app.route("/api/analyze-video", methods=["POST"])
def analyze_video():
    if "video" not in request.files:
        return jsonify({"error": "No video provided"}), 400

    file = request.files["video"]
    use_esrgan = request.form.get("enhance", "false").lower() == "true"

    suffix = os.path.splitext(file.filename)[-1] or ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    try:
        cap = cv2.VideoCapture(tmp_path)

        if not cap.isOpened():
            return jsonify({"error": "Could not open video file"}), 400

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        FRAME_STEP = max(1, int(fps // 3))

        label_stats = {}
        frames_analyzed = 0
        frame_index = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_index % FRAME_STEP == 0:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_image = Image.fromarray(rgb_frame)

                if use_esrgan:
                    pil_image = enhance(pil_image)

                results = yolo_model(pil_image)[0]
                frames_analyzed += 1

                for box in results.boxes:
                    confidence = float(box.conf[0])
                    class_index = int(box.cls[0])
                    label = CLASS_NAMES[class_index]
                    if label not in label_stats:
                        label_stats[label] = {"total_confidence": 0, "count": 0}
                    label_stats[label]["total_confidence"] += confidence * 100
                    label_stats[label]["count"] += 1

            frame_index += 1

        cap.release()

        summary = []
        for label, stats in label_stats.items():
            avg_confidence = stats["total_confidence"] / stats["count"]
            summary.append({
                "label": label,
                "times_detected": stats["count"],
                "avg_confidence": round(avg_confidence, 2),
            })

        summary.sort(key=lambda d: d["times_detected"], reverse=True)
        primary_finding = summary[0]["label"] if summary else "No findings"

        return jsonify({
            "success": True,
            "enhanced": use_esrgan,
            "primary_finding": primary_finding,
            "summary": summary,
            "frames_analyzed": frames_analyzed,
            "total_frames": total_frames,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        os.remove(tmp_path)


# Health check
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "running"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)