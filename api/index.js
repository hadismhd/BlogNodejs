const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 
const cors = require('cors')
const authRoute = require('./routes/auth')
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")));


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

const Mongourl = 'mongodb://localhost:27017/udemy'
mongoose.connect(Mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err));
    
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
//    UPLOAD FILE
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
  });


app.listen("5000", () => {
    console.log("Backend is running on 5000.");
  });
  