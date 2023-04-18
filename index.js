// index.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = 4000;
const multer = require("multer");
const { Storage, File } = require("@google-cloud/storage");
const { format } = require("util");
const GCLOUD_PROJECT_ID = "kyberai-sharing";
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const GCLOUD_PROJECT_KEYFILE = path.join(__dirname, "./config/kyberai-sharing-42664d832f02.json");
console.log("🚀 ~ file: index.js:15 ~ __dirname:", GCLOUD_PROJECT_KEYFILE);

const storage = new Storage({ keyFilename: GCLOUD_PROJECT_KEYFILE, projectId: GCLOUD_PROJECT_ID });

const bucket = storage.bucket("kyberai_sharing");

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.use(cors());
app.listen(PORT, () => {
  console.log(`API listening on PORT 123 ${PORT} `);
});

app.get("/", (req, res) => {
  const metaImage = req.query.imageurl;
  const redirectUrl = req.query.redirecturl;
  const filePath = path.resolve("./index.html");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
    }
    return console.log(err);
    if (metaImage) {
      data = data.replace("@META_IMAGE", metaImage);
    }
    data = data.replace('"@REDIRECT_URL"', `"${redirectUrl}"` || undefined);
    res.send(data);
  });
});

app.disable("x-powered-by");

app.post("/upload", multerMid.single("file"), async (req, res, next) => {
  if (!req.body.file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  try {
    const base64EncodedString = req.body.file.replace(/^data:\w+\/\w+;base64,/, "");
    const buffer = Buffer.from(base64EncodedString, "base64");
    const fileName = uuidv4() + ".png";
    const blob = bucket.file(fileName);
    blob.save(buffer);

    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${fileName}`);

    res.status(200).send(publicUrl);
  } catch (err) {
    next(err);
  }
});

// Export the Express API
module.exports = app;
//AIzaSyAmjh7mt_9D6Qqo4XSQOndRSBTyIuEFFEM
