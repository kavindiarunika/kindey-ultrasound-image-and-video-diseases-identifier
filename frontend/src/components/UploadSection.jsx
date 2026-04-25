import React, { useState } from "react";
import UploadArea from "./UploadArea";
import Prediction from "./Prediction";

function UploadSection() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = (result) => {
    setPrediction(result);
  };

  const handleLoading = (loading) => {
    setIsLoading(loading);
  };

  const handleNewAnalysis = () => {
    setPrediction(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Kidney Ultrasound Analysis
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!prediction && !isLoading ? (
          <UploadArea
            onPrediction={handlePrediction}
            onLoading={handleLoading}
          />
        ) : (
          <>
            <Prediction isLoading={isLoading} result={prediction} />
            {prediction && !isLoading && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleNewAnalysis}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                  Analyze Another Image
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UploadSection;
