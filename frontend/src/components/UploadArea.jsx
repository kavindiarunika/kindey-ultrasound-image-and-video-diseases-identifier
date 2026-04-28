import React, { useState } from "react";

const UploadArea = () => {
  const [file, setFile] = useState(null);         // blob URL for preview
  const [rawFile, setRawFile] = useState(null);   // actual File object to send to Flask
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      setRawFile(selectedFile);           // ✅ keep the real File object
      setFileType(selectedFile.type);
      setResults(null);                   // clear previous results
      setError(null);
    }
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ✅ Send the image to your Flask backend
  const handleAnalyze = async () => {
    if (!rawFile) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("image", rawFile);   // "image" must match request.files["image"] in Flask

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResults(data);
      }
    } catch (err) {
      setError("Could not connect to the server. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: pick a color per label
  const labelColor = (label) => {
    const colors = {
      Normal: "bg-green-100 text-green-800 border-green-300",
      Cyst:   "bg-yellow-100 text-yellow-800 border-yellow-300",
      Stone:  "bg-orange-100 text-orange-800 border-orange-300",
      Tumor:  "bg-red-100 text-red-800 border-red-300",
    };
    return colors[label] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-6">

      {/* ── Upload Box ── */}
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-80 h-56 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        {file ? (
          <img src={file} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Drag & Drop</p>
            <p className="text-sm">or Click to Upload</p>
          </div>
        )}
      </label>

      {/* ── Analyze Button ── */}
      {rawFile && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>
      )}

      {/* ── Error Message ── */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* ── Results ── */}
      {results && (
        <div className="w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-3">
            {results.total_found === 0
              ? "No findings detected"
              : `${results.total_found} finding(s) detected`}
          </h2>

          {results.detections.map((det, i) => (
            <div
              key={i}
              className={`flex justify-between items-center border rounded-lg px-3 py-2 mb-2 text-sm font-medium ${labelColor(det.label)}`}
            >
              <span>{det.label}</span>
              <span>{det.confidence}% confidence</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadArea;