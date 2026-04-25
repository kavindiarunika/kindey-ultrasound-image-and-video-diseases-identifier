// ─────────────────────────────────────────────────────────────
// api.js  —  drop this in your React src/  folder
// Handles all communication with the Flask kidney detection API
// ─────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:5000"; // Change to your server URL in production

/**
 * Send an image file to the Flask backend for kidney disease prediction.
 *
 * @param {File} imageFile  - The File object from an <input type="file"> or drag-drop
 * @returns {Promise<{predicted_class: string, confidence: number, all_probabilities: object}>}
 */
export async function predictKidneyImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile); // key must match request.files["image"] in Flask

  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type manually — browser sets it with boundary for multipart
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Prediction request failed");
  }

  return await response.json();
  // Returns: { predicted_class, confidence, all_probabilities }
}

/**
 * Check if the Flask server is alive.
 * Call this on page load to show a connection status indicator.
 */
export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  return response.ok;
}


// ─────────────────────────────────────────────────────────────
// Example usage inside a React component:
// ─────────────────────────────────────────────────────────────
//
// import { predictKidneyImage } from "./api";
//
// const handleFileChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;
//
//   try {
//     const result = await predictKidneyImage(file);
//     console.log("Predicted class:", result.predicted_class);
//     console.log("Confidence:", result.confidence, "%");
//     console.log("All probabilities:", result.all_probabilities);
//     // → { cyst: 3.21, normal: 1.05, stone: 91.33, tumor: 4.41 }
//   } catch (err) {
//     console.error("Error:", err.message);
//   }
// };
//
// return <input type="file" accept="image/*" onChange={handleFileChange} />;