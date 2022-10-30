const express = require('express')
const multer = require('multer')
const path=require('path')
const app = express();
var Jimp = require('jimp');

const PORT = 8080;
const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname + '-' + uniqueSuffix + "." + extension)
      
    }
  })
  
const upload = multer({ storage: storage })


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
  

app.get('/uploads', function (req, res) {
    const { url } = req.query
    res.sendFile(path.join(__dirname, `${url}`));
    //show uploaded image
});

  
app.post('/profile', upload.single('photos'), function (req, res, next) {
  // req.file is the `photos` file
  // req.body will hold the text fields, if there were any
    res.json(req.file)
})

app.post('/image-modify', upload.single('photos'), function (req, res, next) {
// Jimp is used to modify and manupulate images 
  Jimp.read(req.file.path)
    .then(image => {
    return image
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write(`uploads/modified/${req.file.filename}`); // save
      
  })
  .catch(err => {
    console.error(err);
  });
    res.json(req.file)
})



app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any

  res.json(req.file)
})

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
  res.json(req.file)
})



app.listen(PORT,()=>{console.log(`App id listening at port ${PORT}`)})