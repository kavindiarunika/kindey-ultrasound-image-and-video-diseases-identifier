export const getKidneyAdvice = async (label) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a medical assistant specializing in kidney health. A kidney scan has detected: "${label}". Please provide clear, helpful patient advice about this condition including: what it means, symptoms to watch for, lifestyle recommendations, and when to seek medical attention. Keep the response friendly and easy to understand.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Failed to fetch advice from Claude.");
  }

  const data = await response.json();
  return data.content[0].text;
};