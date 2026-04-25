import React from "react";

const ResultSection = ({ result, isLoading, onNewAnalysis }) => {
  if (!result && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl p-8 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Analyzing your image...
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="w-full bg-red-50 border-2 border-red-200 rounded-2xl p-8">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-red-600">Analysis Error</p>
          <p className="text-red-700 mt-2">{result.error}</p>
          <button
            onClick={onNewAnalysis}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Image Preview */}
      <div className="bg-white rounded-2xl p-6 overflow-hidden">
        {result.file && (
          <img
            src={result.file}
            alt="analyzed"
            className="w-full h-auto max-h-96 object-cover rounded-xl"
          />
        )}
      </div>

      {/* Prediction Result */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
        <p className="text-sm opacity-90 mb-2">Predicted Condition</p>
        <h2 className="text-4xl font-bold capitalize mb-4">
          {result.predicted_class}
        </h2>
        <p className="text-lg font-semibold">
          Confidence: {result.confidence}%
        </p>
      </div>

      {/* Probability Distribution */}
      {result.all_probabilities && (
        <div className="bg-white rounded-2xl p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Probability Breakdown
          </h3>
          <div className="space-y-5">
            {Object.entries(result.all_probabilities)
              .sort((a, b) => b[1] - a[1])
              .map(([className, probability]) => (
                <div key={className}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700 capitalize">
                      {className}
                    </span>
                    <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                      {probability}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-700 ${
                        probability > 50
                          ? "bg-green-500"
                          : probability > 25
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${probability}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
        <p className="text-sm text-yellow-800">
          <strong>Medical Disclaimer:</strong> This AI analysis is for
          informational purposes only. Always consult a qualified medical
          professional for accurate diagnosis and treatment.
        </p>
      </div>

      {/* Actions */}
      <button
        onClick={onNewAnalysis}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-200"
      >
        Analyze Another Image
      </button>
    </div>
  );
};

export default ResultSection;
