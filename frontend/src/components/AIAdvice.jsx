import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../kidneycontext/appContext";

const getKidneyAdvice = async (label) => {
  const response = await fetch("/api/ai/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "model": "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a medical education assistant specializing in kidney health. A kidney scan has detected: "${label}".

Please provide clear, helpful patient advice about this condition including:
- What it means
- Symptoms to watch for
- Lifestyle recommendations
- Diet suggestions
- When to seek medical attention

IMPORTANT: Do NOT diagnose. Always recommend consulting a doctor.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Failed to fetch advice.");
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "No advice available";
};

const AIAdvice = () => {
  const { result } = useContext(AppContext);

  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdvice = async () => {
      if (!result?.detections?.length) return;

      const topDetection = [...result.detections].sort(
        (a, b) => b.confidence - a.confidence
      )[0];

      setLoading(true);
      setAdvice("");
      setError("");

      try {
        const aiText = await getKidneyAdvice(topDetection.label);
        setAdvice(aiText);
      } catch (err) {
        console.error("AIAdvice Error:", err);
        setError(err.message || "Failed to load AI advice.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [result]);

  if (!result?.detections?.length) return null;

  return (
    <div className="mt-10 p-6 rounded-2xl bg-white/10 border border-emerald-400/30 text-white">
      <h2 className="text-2xl font-bold mb-4">AI Patient Advice</h2>

      {loading ? (
        <p className="text-gray-300">Generating advice...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <p className="whitespace-pre-line text-gray-200">{advice}</p>
      )}
    </div>
  );
};

export default AIAdvice;