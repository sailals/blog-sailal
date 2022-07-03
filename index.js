const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/post");
const catRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

app.use(express.json());
app.use(cors());

app.use("/Images", express.static(path.join(__dirname, "/Images")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to Mongo DB atlas successfully"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/cat", catRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Started at port 5000");
});
