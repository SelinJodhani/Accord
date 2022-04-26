const multer = require('multer');
const path = require('path');
const createError = require('http-errors');
const DatauriParser = require('datauri/parser');
const cloudinary = require('cloudinary').v2;

/**
 ** Multer configuration for image upload (Temporary uploads a file to the memory)
 *  @returns Middleware function
 */
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image'))
    cb(new createError(400, 'Only image file is allowed!'), false);
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

const uploadImage = upload.single('image');

/**
 ** Image buffer to base64 string
 *  @returns Base64 string of the image
 */
const parser = new DatauriParser();
const dataUri = function (filename, buffer) {
  return parser.format(path.extname(filename).toString(), buffer);
};

/**
 ** Upload image to cloudinary
 *  @returns Cloudinary image URL
 */
const uploadToCloud = model => {
  return async (req, res, next) => {
    if (!req.file) return next();

    const { content } = dataUri(req.file.originalname, req.file.buffer);

    const path = model.toLowerCase() + 's';
    const image = await cloudinary.uploader.upload(content, {
      height: 400,
      width: 400,
      crop: 'scale',
      upload_preset: `upload_for_${path}`,
    });
    req.image = image.secure_url;
    return next();
  };
};

module.exports = { uploadImage, uploadToCloud };
