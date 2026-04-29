import React from "react";
import { AppContext } from "../kidneycontext/appContext";

const Output = () => {
  const { result } = React.useContext(AppContext);

  const labelColor = (label) => {
    const colors = {
      Normal: "bg-green-500/20 text-green-300 border-green-500",
      Cyst: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
      Stone: "bg-orange-500/20 text-orange-300 border-orange-500",
      Tumor: "bg-red-500/20 text-red-300 border-red-500",
    };
    return colors[label] || "bg-gray-500/20 text-gray-300 border-gray-500";
  };

  const topDetection =
    result?.detections?.length
      ? [...result.detections].sort((a, b) => b.confidence - a.confidence)[0]
      : null;

  return (
    <div>
      {topDetection ? (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Detection Result</h3>
          <div
            className={`flex justify-between items-center border-2 rounded-lg px-6 py-4 text-base font-semibold ${labelColor(
              topDetection.label
            )}`}
          >
            <span className="text-lg">{topDetection.label}</span>
            <span className="text-lg">{topDetection.confidence}% confidence</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">Upload and analyze an image to see results</p>
      )}
    </div>
  );
};

export default Output;