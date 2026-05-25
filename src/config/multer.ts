import multer from "multer";

const storage = multer.memoryStorage(); // stores file in req.file.buffer

export const upload = multer({ storage });
