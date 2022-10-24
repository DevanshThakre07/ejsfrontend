const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const about = require('./')

const app = express();
app.use('/CSS', express.static('CSS'))
app.use('/Images', express.static('Images'))
// middleware
app.use(bodyParser.json());
app.use(methodOverride('_mehtod'));
app.set('view engine', 'ejs');

//mogodbURI
const mongoURI = 'mongodb+srv://DevanshThakre:devanshthakre@cluster0.qhlf6fj.mongodb.net/?retryWrites=true&w=majority';

//create mngo connection 
const conn = mongoose.createConnection(mongoURI);

//init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//create stroage engine
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
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// @route GET /
// @desc Loads form

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/about', (req, res) => {
    res.render('about');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/signup', (req, res) => {
    res.render('signup');
})

// @route POST /upload
// @desc  Uploads file to DB  
app.post('/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    res.redirect('/');

});
const port = 2000;

app.listen(port, () => console.log('Server started on port:', port));