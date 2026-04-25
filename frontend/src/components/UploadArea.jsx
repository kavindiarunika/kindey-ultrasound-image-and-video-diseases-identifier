import React from "react";
import { predictKidneyImage } from "../api/Api";

function UploadArea({ onPrediction, onLoading }) {
  const [file, setFile] = React.useState(null);
  const [fileType, setFileType] = React.useState("");

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);
      // Automatically send to backend for prediction
      handlePredict(selectedFile);
    }
  };

  const handlePredict = async (imageFile) => {
    if (!imageFile) return;

    onLoading(true);
    try {
      const result = await predictKidneyImage(imageFile);
      onPrediction({
        file: URL.createObjectURL(imageFile),
        fileType: imageFile.type,
        ...result,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      onPrediction({
        error: error.message,
        file: URL.createObjectURL(imageFile),
        fileType: imageFile.type,
      });
    } finally {
      onLoading(false);
    }
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Upload Kidney Ultrasound Images
          </h1>
          <p className="text-gray-500 mt-2">
            Drag & drop your image or click below to upload
          </p>
        </div>

        {/* Upload Area */}
        <label
          className="w-full h-[420px] border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer flex items-center justify-center overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="uploaded"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-500">
              {/* Upload Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="55"
                height="55"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="mx-auto mb-4"
              >
                <path d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0m-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0" />
              </svg>

              <p className="text-2xl font-semibold">Drag & Drop</p>
              <p className="text-sm mt-1">or Click to Upload</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

export default UploadArea;
