const {
  getSuggestions,
  getSmartReplies,
} = require("../utils/geminiService");

exports.suggestions = async (req, res) => {
  try {
    const { text } = req.body;
console.log("TEXT IS HERE",text)
    if (!text) {
      return res.json([]);
    }

    const suggestions = await getSuggestions(text);

    res.json(suggestions);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


exports.replies = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json([]);
    }

    const replies = await getSmartReplies(message);

    res.json(replies);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};