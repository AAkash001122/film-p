const express = require("express");
const router = express.Router();

// Reels ke links yahan daal de jitne dikhane hain (tu apne real links daal)
const reels = [
  "https://www.instagram.com/reel/DUAPd7xAUmn/",
  // yahan aur daal de jitne chahiye
];

router.get("/popular", (req, res) => {
  res.json(
    reels.map((url, index) => ({
      _id: `reel_${index}`,
      title: "Reel " + (url.split('/reel/')[1]?.slice(0,6) || ""),
      poster: "",
      trailerUrl: `${url}/embed`
    }))
  );
});

module.exports = router;