// index.js
const express = require("express");
const path = require("path");
const app = express();
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/", (req, res) => {
  const metaImage = req.query.imageurl;
  const filePath = path.resolve("./index.html");
  if (metaImage) {
    filePath.replace("@META_IMAGE", metaImage);
  }
  res.sendFile(filePath);
});

app.get("/about", (req, res) => {
  res.send("This is my about route..... ");
});

// Export the Express API
module.exports = app;
