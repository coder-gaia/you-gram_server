const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotosRoutes"));

router.get("/", (req, res) => {
  res.send("API route working!");
});

module.exports = router;
