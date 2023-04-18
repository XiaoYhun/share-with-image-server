const { Storage } = require("@google-cloud/storage");

const path = require("path");

const GCLOUD_PROJECT_ID = "123";

const GCLOUD_PROJECT_KEYFILE = path.join(__dirname, "./");

const storage = new Storage({ keyFilename: GCLOUD_PROJECT_KEYFILE, projectId: GCLOUD_PROJECT_ID });
