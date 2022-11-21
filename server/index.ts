const express = require('express')

const bodyParser = require('body-parser');

const cors = require("cors");
 
const multer = require('multer')
 
const path = require('path')
 
const app = express()

const Logger = require('node-json-logger');
const { response } = require('express');
const logger = new Logger();


app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())


// var corsConfig = {
//     origin: ['http://localhost:8888','http://localhost:8888/uploadfile'],
//     methods: 'GET,POST,PATCH,DELETE,OPTIONS',
//     optionsSuccessStatus: 200,
//     function(req, res, next) {
//       res.header('Access-Control-Allow-Origin', "***Your IP***");
//       res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//       res.header('Access-Control-Allow-Headers', 'Content-Type');
//       next();}
//   };
//   app.use(cors(corsConfig));

app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
 
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('file')
 
const multiple = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('multiple',50)
 
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
 
app.get('/multiple', (req, res) => {
    res.sendFile(__dirname + "/multiple.html")
})
 
app.post('/uploadfile', function (req, res) {
    // const body = req.body
    // let error = {}
    // logger.setLogData(body)
    // logger.info("request at /uploadfile", req.body)
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            logger.error(err)
        } else if (err) {
            logger.error(err)
        }
        else {
            // console.log(req.file);
            logger.info(req.file.path)
        }
        return res.status(200).send(response);
        // return logger.info.send(response);
    })
})
 
app.post('/uploadmultiple',(req, res) => {
    multiple(req,res,(err) => {
        if (req.files) {
            req.files.forEach(file => {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                } else if (err) {
                    console.log(err)
                }
                else {
                    console.log(file.path)
                }
            });
        }
    })
})
 
app.listen(8888, () => {
    console.log("App is listening on port 8888")
})