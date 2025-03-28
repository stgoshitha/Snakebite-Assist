const Snake = require("../models/SnakeModel.js");

const search = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ message: "Keyword is required" });
  }

  try {
    const terms = keyword.trim().split(/\s+/);

    let searchConditions = [];

    terms.forEach((term) => {
      if (/^\d+(\.\d+)?$/.test(term)) {
        const size = parseFloat(term);
        searchConditions.push({ size: size });
      } else if (/^\d+(\.\d+)?-\d+(\.\d+)?$/.test(term)) {
        const [min, max] = term.split("-").map(Number);
        searchConditions.push({ size: { $gte: min, $lte: max } });
      } else {
        const regex = new RegExp(term, "i");
        searchConditions.push({
          $or: [
            { color: { $regex: regex } },
            { pattern: { $regex: regex } },
            { headShape: { $regex: regex } },
            { name: { $regex: regex } }
          ]
        });
      }
    });

    const searchQuery = searchConditions.length > 0 ? { $or: searchConditions } : {};

    const snakes = await Snake.find(searchQuery).limit(10);

    res.json({ data: snakes });
  } catch (error) {
    console.error("Error during snake search:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { search };
