const Snake = require("../models/SnakeModel.js");
const Hospital = require("../models/Hospital.js");

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


// Convert degrees to radians
const toRad = (deg) => (deg * Math.PI) / 180;

// Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findNearestHospitals = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and longitude required" });
  }

  try {
    const hospitals = await Hospital.find({});

    const hospitalsWithDistance = hospitals
      .map((hospital) => {
        const coords = hospital.location?.coordinates;
        if (coords && coords.length === 2) {
          const [lng2, lat2] = coords;
          const distance = getDistance(
            parseFloat(lat),
            parseFloat(lng),
            lat2,
            lng2
          );

          return {
            ...hospital.toObject(),
            distanceInKm: parseFloat(distance.toFixed(2))
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.distanceInKm - b.distanceInKm)
      .slice(0, 5);

    if (hospitalsWithDistance.length === 0) {
      return res.status(404).json({ message: "No nearby hospitals found" });
    }

    res.json({
      message: "Nearest hospitals found",
      data: hospitalsWithDistance,
    });

  } catch (error) {
    console.error("Error finding nearest hospitals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { search ,findNearestHospitals};
