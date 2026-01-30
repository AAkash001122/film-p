const express = require("express");
const router = express.Router();
const Reel = require("../models/Reel");

/**
 * 🎯 Extract Reel Code from Instagram URL
 */
const extractReelCode = (url) => {
  try {
    return url.split("/reel/")[1].split("/")[0];
  } catch {
    return null;
  }
};

/**
 * 🎯 Convert Reel Code → Embed URL
 */
const getEmbedUrl = (url) => {
  const code = extractReelCode(url);
  return code ? `https://www.instagram.com/p/${code}/embed` : url;
};

/**
 * 🎯 Format for frontend
 */
const formatReel = (reel) => ({
  _id: reel._id,
  title: reel.title,
  poster: reel.thumbnail || "https://via.placeholder.com/300x400?text=No+Image",
  trailerUrl: getEmbedUrl(reel.url),
  year: "2024",
  type: "Reel",
});

/**
 * GET /api/reels
 */
router.get("/", async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels.map(formatReel));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reels nahi mile" });
  }
});

/**
 * GET /api/reels/popular
 */
router.get("/popular", async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 }).limit(10);
    res.json(reels.map(formatReel));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reels nahi mile" });
  }
});

/**
 * POST /api/reels
 * ✅ Single + Multiple reels
 */
router.post("/", async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    // 🔥 MULTIPLE REELS
    if (Array.isArray(req.body)) {
      const reelsToInsert = req.body
        .map((item) => {
          if (!item.url || !item.title) return null;

          const reelCode = extractReelCode(item.url);
          if (!reelCode) return null;

          return {
            title: item.title,
            url: item.url,
            reelCode,
            thumbnail: item.thumbnail,
          };
        })
        .filter(Boolean); // ❌ invalid remove

      if (reelsToInsert.length === 0) {
        return res.status(400).json({
          message: "Valid reels nahi mile",
        });
      }

      const savedReels = await Reel.insertMany(reelsToInsert, {
        ordered: false, // duplicates skip
      });

      return res.status(201).json({
        message: `${savedReels.length} reels added successfully`,
      });
    }

    // 🔥 SINGLE REEL
    const { url, title, thumbnail } = req.body;
    if (!url || !title) {
      return res.status(400).json({
        message: "url aur title required hai",
      });
    }

    const reelCode = extractReelCode(url);
    if (!reelCode) {
      return res.status(400).json({
        message: "Invalid Instagram reel URL",
      });
    }

    const newReel = await Reel.create({
      title,
      url,
      reelCode,
      thumbnail,
    });

    res.status(201).json({
      message: "Reel added successfully",
      data: newReel,
    });
  } catch (err) {
    console.error("POST /api/reels error:", err.message);
    res.status(500).json({ message: "Reel add nahi hua" });
  }
});

module.exports = router;
