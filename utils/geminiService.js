require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model:"gemini-3-flash-preview"
})


 exports.getSuggestions = async (text) => {
  try {

     console.log("GEMINI SERVICE CALLED", text)
    const prompt = `
      You are an AI typing assistant.

      Suggest 3 short next phrase completions.

      Rules:
      - Keep suggestions short.
      - Max 5 words.
      - Return only JSON array.
      - No numbering.
      - No explanation.

      User Input:
      "${text}"
    `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return JSON.parse(response);
  } catch (err) {
    console.log(err);
    return [];
  }
};

// Smart Replies
exports.getSmartReplies = async (message) => {
  try {
    const prompt = `
      Generate 3 smart chat replies.

      Rules:
      - Short replies.
      - Friendly tone.
      - Max 6 words.
      - Return only JSON array.
      - No explanation.

      Incoming Message:
      "${message}"
    `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return JSON.parse(response);
  } catch (err) {
    console.log(err);
    return [];
  }
};
