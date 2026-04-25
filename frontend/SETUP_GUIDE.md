# Kidney Ultrasound Image & Video Diseases Identifier

A simple web application for analyzing kidney ultrasound images and videos to identify diseases including tumors, cysts, stones, and normal cases.

## Features

- ✅ Upload images and videos (drag & drop support)
- ✅ Real-time preview before analysis
- ✅ Disease classification (Tumor, Cyst, Stone, Normal)
- ✅ Confidence score display
- ✅ Prediction percentages for all diseases
- ✅ Clean, simple UI
- ✅ Responsive design

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── UploadSection.jsx       # File upload component
│   │   └── ResultSection.jsx       # Results display component
│   ├── pages/
│   │   └── Analyzer.jsx            # Main analyzer page
│   ├── styles/
│   │   ├── Analyzer.css            # Main page styles
│   │   ├── UploadSection.css       # Upload styles
│   │   └── ResultSection.css       # Results styles
│   ├── App.jsx                     # App component
│   └── main.jsx                    # Entry point
├── app.py                          # Flask backend
├── requirements.txt                # Python dependencies
└── package.json                    # Node dependencies
```

## Setup Instructions

### 1. Frontend Setup (React + Vite)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 2. Backend Setup (Flask)

#### Create a Python virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python dependencies:

```bash
pip install -r requirements.txt
```

#### Configure your .pth models:

Edit `app.py` and update the model paths:

```python
MODEL_PATH_1 = 'models/model1.pth'  # Your first model
MODEL_PATH_2 = 'models/model2.pth'  # Your second model
```

#### Implement model loading in `app.py`:

```python
# Uncomment these lines and adjust for your models
# model_1 = torch.load(MODEL_PATH_1)
# model_2 = torch.load(MODEL_PATH_2)

# Add your preprocessing logic to match your model's input requirements
```

#### Start the backend:

```bash
python app.py
```

The backend will run on `http://localhost:5000`

## How to Use

1. **Start both servers:**
   - Frontend: `npm run dev` (runs on port 5173)
   - Backend: `python app.py` (runs on port 5000)

2. **Upload an image or video:**
   - Click on the upload area or drag & drop a file
   - Supported formats: PNG, JPG, JPEG, MP4, AVI, MOV, WEBM

3. **View results:**
   - Disease classification with confidence score
   - Breakdown of all predictions
   - Processing timestamp

## Integrating Your .pth Models

### Step 1: Place your models

Create a `models/` folder and place your `.pth` files:

```
models/
├── model1.pth
└── model2.pth
```

### Step 2: Load models in app.py

```python
import torch

# Load models
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model_1 = torch.load('models/model1.pth', map_location=device)
model_1.to(device)
model_1.eval()

# Repeat for model_2 if needed
```

### Step 3: Implement preprocessing

Update the `process_image()` function with your model's specific requirements:

```python
def process_image(image_file):
    img = Image.open(image_file).convert('RGB')

    # Adjust based on your model requirements
    img = img.resize((224, 224))  # Your model's input size

    # Your preprocessing pipeline
    img_tensor = your_preprocessing_function(img)
    img_tensor = img_tensor.to(device)

    with torch.no_grad():
        outputs = model_1(img_tensor)
        predictions = torch.softmax(outputs, dim=1)

    # Return predictions
    return {
        "disease": DISEASES[predictions.argmax()],
        "accuracy": float(predictions.max().item() * 100),
        "allPredictions": [...]
    }
```

### Step 4: Handle video processing (optional)

For video files, extract frames and process them:

```python
import cv2

def process_video(video_file):
    cap = cv2.VideoCapture(video_file)
    predictions = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Process each frame (sample every N frames for efficiency)
        if len(predictions) % 10 == 0:
            predictions.append(analyze_frame(frame))

    # Aggregate predictions (e.g., by voting or averaging)
    final_prediction = aggregate_predictions(predictions)
    return final_prediction
```

## API Endpoints

### POST /api/analyze

Upload an image or video for analysis.

**Request:**

- `file`: File to analyze (form-data)

**Response:**

```json
{
  "disease": "Normal",
  "accuracy": 92.5,
  "allPredictions": [
    { "disease": "Normal", "accuracy": 92.5 },
    { "disease": "Tumor", "accuracy": 5.2 },
    { "disease": "Cyst", "accuracy": 1.8 },
    { "disease": "Stone", "accuracy": 0.5 }
  ]
}
```

### GET /api/health

Health check endpoint.

## Technologies Used

**Frontend:**

- React 19
- Vite
- CSS3

**Backend:**

- Flask
- PyTorch
- Python 3.8+

## Supported Diseases

- **Normal**: No abnormalities detected
- **Tumor**: Kidney tumor detected
- **Cyst**: Kidney cyst identified
- **Stone**: Kidney stone found

## Notes

- The current implementation includes mock predictions. Replace with actual model inference
- Adjust image preprocessing parameters based on your model's requirements
- For GPU support, ensure PyTorch CUDA version matches your system
- Video processing may require frame extraction (use OpenCV)

## Troubleshooting

**CORS Error:**

- Ensure Flask-CORS is installed: `pip install flask-cors`

**Model Loading Error:**

- Verify `.pth` file paths in `app.py`
- Ensure model architecture matches the saved weights

**Port Already in Use:**

- Change port in `app.py`: `app.run(port=5001)`
- Change Vite port in `vite.config.js`

## Future Enhancements

- [ ] Multi-model ensemble predictions
- [ ] Real-time video streaming analysis
- [ ] Export results as PDF
- [ ] Database to store analysis history
- [ ] Advanced visualization with heatmaps
- [ ] Batch processing capabilities
