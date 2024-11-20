const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../cloudinary'); 

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'BILL-splitter-profile-pic', 
        allowed_formats: ['jpg', 'png'],    
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
