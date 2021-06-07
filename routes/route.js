const { Router } = require("express")
const Test = require("../models/testModel")
const router = Router()
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

// Mongo URI
const mongoURI = 'mongodb+srv://Ivan:ue8MbKsgR6SEcR2@cluster0.vnsy8.mongodb.net/test';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        }
        resolve(fileInfo);
      })
    })
  }
})
const upload = multer({ storage })

// @route POST /upload
// @desc  Uploads file to DB
router.post("/upload", upload.single("file"), (req, res) => {
   res.json({ file: req.file })

});

router.get("/test", async(req, res) =>{
    const test = await Test.find({})

    res.status(200).json(test)
})

// @route GET /files
// @desc  Display all files in JSON
router.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      })
    }

    // Files exist
    return res.json(files)
  });
});

// @route GET /image/:filename
// @desc Display Image
router.get('/audio/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'audio/mpeg' ) {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an audio'
      });
    }
  });
});
  
  router.post('/create', async (req, res) => {
    // Test.insertMany(
    //   [
    //     { title: "Scooby" },
    //     { title: "Rambo" },
    //     { title: "Johny boy" }
    //   ],
    //   function(err, result) {
    //     if (err) {
    //       res.send(err);
    //     } else {
    //       res.send(result);
    //     }
    //   }
    // );
    const test = new Test({
      title: req.body.title
    })
    await test.save(function (err, test){
      if(err){
        res.send(err.message)
      }else{
        res.status(200).json({
          message: "No error"
        })
      }
    })
  })

module.exports = router
