import React, { useState } from "react";
import { AppContext } from "../kidneycontext/appContext";
import { useNavigate } from "react-router-dom";
import Enhanced from "./Enhanced";

const UploadArea = () => {
  const navigate = useNavigate();

  const { result, setResult, enhanceOn, setEnhanceOn } =
    React.useContext(AppContext);

  const [file, setFile] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      setRawFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleAnalyze = async () => {
    if (!rawFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", rawFile);
      formData.append("enhance", enhanceOn ? "true" : "false");

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[090vh] max-w-5xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8">

      
      {/* Enhancement Toggle */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <span className="text-2xl text-white font-medium">
          Image Enhancement
        </span>

        <button
          onClick={() => setEnhanceOn(!enhanceOn)}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
            enhanceOn ? "bg-emerald-500" : "bg-gray-500"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
              enhanceOn ? "translate-x-7" : ""
            }`}
          ></span>
        </button>
            {/* Buttons */}
      {rawFile && (
           <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-2 mb-2 py-4 px-4  rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>

        
       
      )}
      </div>

      {/* Upload Box */}
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="group relative w-full h-[450px] rounded-3xl border-2 border-dashed border-emerald-400/60 bg-white/5 hover:bg-white/10 hover:border-emerald-300 transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center shadow-xl"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {/* background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-400/10"></div>

        {file ? (
          <img
            src={file}
            alt="preview"
            className="w-full h-full object-contain p-6 relative z-10"
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">

           
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="70"
                height="70"
                fill="currentColor"
                className="text-gray-400"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
              </svg>
           

            <h2 className="text-3xl  text-white">
              Upload kidney image or video
            </h2>

            <p className="text-gray-300 mt-3 text-lg">
              Drag & Drop image or click to browse
            </p>

          </div>
        )}
      </label>

  

      <div className="mt-4">
         <Enhanced/>
      </div>
  
      {/* Error */}
      {error && (
        <p className="text-red-400 text-center mt-6 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default UploadArea;