import multer from "multer";

// Configure storage options for multer
const storage = multer.diskStorage({
  // Set the filename for the uploaded file
  filename: function (req, file, callback) {
    callback(null, file.originalname); // Use the original file name
  },
});

// Create an instance of multer with the defined storage
const upload = multer({ storage });

export default upload;
