const multer = require('multer');
const AppError = require('../utils/appError');

module.exports = function (model) {
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderName = `${model.toLowerCase()}s`;
      cb(null, `public/images/${folderName}`);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `${model}-${req.user._id}-${Date.now()}.${ext}`);
    },
  });

  const multerFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image'))
      cb(new AppError('Only image file is allowed!', 400), false);
    cb(null, true);
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 3 * 1024 * 1024 },
  });

  return upload.single('image');
};
