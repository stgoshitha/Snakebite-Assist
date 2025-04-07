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
      if (/^\d+(\.\d+)?\s*(m|meter|meters)?$/.test(term)) {
        //integer or decimal values
        const size = parseFloat(term);
        searchConditions.push({
          length: { $regex: `^${size} (meter|meters)?$`, $options: "i" },
        });
      } else if (/^\d+(\.\d+)?-\d+(\.\d+)?\s*(m|meter|meters)?$/.test(term)) {
        //give as range "4-6"
        const [min, max] = term.split("-").map(Number);
        searchConditions.push({
          length: { $gte: `${min} meter`, $lte: `${max} meter` },
        });
      } else {
        //color, pattern, name, headShape
        const regex = new RegExp(term, "i");
        searchConditions.push({
          $or: [
            { name: { $regex: regex } },
            { color: { $regex: regex } },
            { pattern: { $regex: regex } },
            { headShape: { $regex: regex } },
          ],
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
