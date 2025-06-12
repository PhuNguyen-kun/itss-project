const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/ApiError");

// Ensure upload directories exist
const uploadDir = path.join(__dirname, "../../public/uploads");
const avatarDir = path.join(uploadDir, "avatars");
const dishesDir = path.join(uploadDir, "dishes");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

if (!fs.existsSync(dishesDir)) {
    fs.mkdirSync(dishesDir, { recursive: true });
}

// Configure storage for avatars
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, avatarDir);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename with user ID, timestamp and original extension
        const userId = req.user ? req.user.id : "unknown";
        const timestamp = Date.now();
        const fileExt = path.extname(file.originalname);
        const filename = `user-${userId}-${timestamp}${fileExt}`;
        cb(null, filename);
    },
});

// Configure storage for dish images
const dishStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dishesDir);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename with timestamp and original extension
        const timestamp = Date.now();
        const fileExt = path.extname(file.originalname);
        const filename = `dish-${timestamp}${fileExt}`;
        cb(null, filename);
    },
});

// File filter to check image files
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError(
                400,
                "Only image files are allowed (JPEG, PNG, GIF, WEBP)"
            ),
            false
        );
    }
};

// Create multer upload middleware for avatars
const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
    fileFilter: imageFileFilter,
});

// Create multer upload middleware for dishes
const uploadDish = multer({
    storage: dishStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
    fileFilter: imageFileFilter,
});

module.exports = {
    uploadAvatar,
    uploadDish,
};
