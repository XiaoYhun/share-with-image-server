// index.js
const express = require("express");
const path = require("path");
const app = express();
const PORT = 4000;
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const GCLOUD_PROJECT_ID = "kyberai-sharing";

const GCLOUD_PROJECT_KEYFILE = path.join(__dirname, "./config/kyberai-sharing-42664d832f02.json");

const storage = new Storage({ keyFilename: GCLOUD_PROJECT_KEYFILE, projectId: GCLOUD_PROJECT_ID });

const bucket = storage.bucket("kyberai_sharing");

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/", (req, res) => {
  const metaImage = req.query.imageurl;
  const redirectUrl = req.query.redirecturl;
  const filePath = path.resolve("./index.html");
  if (metaImage) {
    filePath.replace("@META_IMAGE", metaImage);
  }
  res.sendFile(filePath);
  if (redirectUrl) {
    res.redirect(redirectUrl);
  }
});

app.disable("x-powered-by");

app.post("/upload", multerMid.single("file"), (req, res, next) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});

// Export the Express API
module.exports = app;
//AIzaSyAmjh7mt_9D6Qqo4XSQOndRSBTyIuEFFEM
