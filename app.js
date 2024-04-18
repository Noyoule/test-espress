import express from 'express'
import { body, validationResult, matchedData } from "express-validator"
import multer from 'multer';
import path from 'path';
import SendMail from './service.js';
import bodyParser from 'body-parser';
import { configDotenv } from 'dotenv';
configDotenv({ path: '.env' })
const app = express()

const destinationPath = path.join('tmp/uploads');

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, destinationPath)
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
})

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/send-email',
  upload.array('files'),
  body('name').trim().notEmpty().isString(),
  body('companyName').trim().notEmpty().isString(),
  body('companyAdresse').trim().notEmpty().isString(),
  body('email').trim().isEmail(),
  body('message').trim().isString().notEmpty(),
  (req, res) => {
    try {
      let files = [];
      const result = validationResult(req);
      if (result.isEmpty()) {
        const data = matchedData(req);
        if (req.files) {
          files = req.files;
        }
        SendMail(data, files)
        res.status(200).json({ status: 200, message: "Mail sent successfully" })
      }else{
        res.json({ errors: result.array() });
      }
    } catch (error) {
      res.status(500).json({ status: 500, error: error.message })
    }
  });


app.listen(process.env.APP_PORT, () => {
  console.log("Server started at http://127.0.0.1:3000")
})

