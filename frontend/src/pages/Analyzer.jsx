import React, { useState } from "react";
import UploadArea from "../components/UploadArea";
import ResultSection from "../components/ResultSection";

function Analyzer() {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Kidney Ultrasound Disease Identifier
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered analysis of kidney ultrasound images using deep learning
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <UploadArea
                onPrediction={handlePrediction}
                onLoading={handleLoading}
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="flex flex-col justify-start">
            {(prediction || isLoading) && (
              <ResultSection
                result={prediction}
                isLoading={isLoading}
                onNewAnalysis={handleNewAnalysis}
              />
            )}
            {!prediction && !isLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-600">
                  Upload an ultrasound image on the left to start the analysis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Advanced AI
            </h3>
            <p className="text-gray-600">
              Uses deep CNN-RNN models for accurate kidney disease detection
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Fast Results
            </h3>
            <p className="text-gray-600">
              Get predictions in seconds with real-time confidence scores
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Reliable</h3>
            <p className="text-gray-600">
              Trained on extensive medical datasets for high accuracy
            </p>
          </div>
        </div>

        {/* Conditions Info */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Detected Conditions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Cyst", "Normal", "Stone", "Tumor"].map((condition) => (
              <div
                key={condition}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500"
              >
                <p className="font-bold text-gray-800">{condition}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Kidney {condition.toLowerCase()} detection
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Kidney Disease Identifier | Medical Disclaimer: For
            informational purposes only
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analyzer;
