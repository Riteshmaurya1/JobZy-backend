const { GoogleGenAI } = require("@google/genai");
const logger = require("../logger/logger");

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY not found in .env file");
}

// Initialize GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate content with Gemini 2.5 Flash
 * @param {string} prompt - The prompt to send to AI
 * @returns {Promise<string>} - AI generated text
 */
async function generateWithGemini(prompt) {
  try {
    logger.info("🤖 [Gemini] Sending request to gemini-2.5-flash...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ✅ FREE & FAST
      contents: prompt,
    });

    logger.info("🤖 [Gemini] ✅ Response received");

    return response.text;
  } catch (error) {
    logger.error("🤖 [Gemini] ❌ Error:", error.message);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

module.exports = { generateWithGemini };
