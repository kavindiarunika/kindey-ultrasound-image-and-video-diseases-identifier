import React from "react";

const Prediction = ({ isLoading, result }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="mt-4 text-xl font-semibold text-gray-700">
              Analyzing Image...
            </p>
            <p className="text-gray-500 mt-2">
              Please wait while we process your ultrasound image
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (result.error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-xl font-semibold text-red-600">
              Prediction Error
            </p>
            <p className="text-gray-700 mt-2">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8">
        {/* Image Preview */}
        <div className="mb-8">
          {result.fileType.startsWith("image") && (
            <img
              src={result.file}
              alt="analyzed"
              className="w-full h-auto max-h-96 object-cover rounded-2xl"
            />
          )}
        </div>

        {/* Prediction Result */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Prediction Result
          </h2>
          <p className="text-gray-500 mt-2">AI-Based Kidney Disease Analysis</p>
        </div>

        {/* Predicted Class */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 text-center">
          <p className="text-gray-600 font-medium mb-2">
            Predicted Disease Type
          </p>
          <p className="text-4xl font-bold text-blue-600 capitalize">
            {result.predicted_class}
          </p>
          <p className="text-gray-600 mt-2">Confidence: {result.confidence}%</p>
        </div>

        {/* Probability Chart */}
        {result.all_probabilities && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Probability Distribution
            </h3>
            <div className="space-y-4">
              {Object.entries(result.all_probabilities).map(
                ([className, probability]) => (
                  <div key={className}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700 capitalize">
                        {className}
                      </span>
                      <span className="text-sm font-bold text-gray-600">
                        {probability}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${probability}%` }}
                      ></div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This prediction is AI-based and should
            be reviewed by a medical professional for accurate diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
