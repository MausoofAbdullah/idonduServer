import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer"
import dotenv from "dotenv";
import path from "path"

import cheerio from "cheerio"
import prerender from "prerender-node"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





// import dotenv from "dotenv";
import cors from "cors" 
// import AuthRoute from "./Routes/Auth.js"
import userRoute from "./Routes/userRoute.js"

const app = express();
app.use(express.static("uploads"))
app.use('/images',express.static("images"))
// app.use(require('prerender-node').set('protocol', 'https'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  prerender.set("prerenderToken", ["LJQq3UXZJOXRCIhol4oI"])
  );

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();




const PORT=4000
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//   app.use('/auth',AuthRoute)
  app.use('/user',userRoute)