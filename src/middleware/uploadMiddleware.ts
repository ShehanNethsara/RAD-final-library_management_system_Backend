import multer from 'multer';
import path from 'path';

// පින්තූර Save වන තැන සහ නම තීරණය කිරීම
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // මුලින් හැදූ uploads folder එකට යවන්න
  },
  filename(req, file, cb) {
    // ගොනුවේ නම: fieldname-date.extension (eg: image-12345678.jpg)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// පින්තූර (Images) පමණක් Upload කිරීමට ඉඩ දීම
const checkFileType = (file: Express.Multer.File, cb: any) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
};

export const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});