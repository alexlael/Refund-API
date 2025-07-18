import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const ULOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGES_TYPES = [
  "image/jpeg",
  "image/pjpg",
  "image/png",
  "image/gif",
];

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};

export default {
  TMP_FOLDER,
  ULOADS_FOLDER,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGES_TYPES,
  MULTER,
};
