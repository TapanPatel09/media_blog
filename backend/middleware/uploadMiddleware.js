const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter validation
function checkFileType(file, cb) {
    if (file.fieldname === 'photo') {
        const filetypes = /jpg|jpeg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images only (jpg/jpeg/png/webp/gif)!'));
        }
    } else if (file.fieldname === 'video') {
        const filetypes = /mp4|webm|ogg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Videos only (mp4/webm/ogg)!'));
        }
    } else {
        cb(new Error('Unknown field!'));
    }
}

// Multer upload middleware setup
const upload = multer({
    storage,
    limits: {
        // Enforce maximum size limits
        fileSize: 20 * 1024 * 1024 // 20 MB max (will handle specific limits logically if needed)
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
