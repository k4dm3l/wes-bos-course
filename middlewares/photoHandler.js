const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter (req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) { 
            next(null, true);
        } else {
            next({ message:'That filetype isn\'t allowed!' }, false);
        }
    }
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    // check if there i no new file to resize
    if (!req.file) {
        next();
        return;
    }

    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    //now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    //once we have written the photo to own filesystem, keep going!
    next();
}