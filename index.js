import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer"
import dotenv from "dotenv";

import React from "react"
import ReactDOMServer from "react-dom/server"
import {HelmetProvider} from 'react-helmet-async'
import {StaticRouter} from "react-router-dom"

import App from './client/src/App'



// import dotenv from "dotenv";
import cors from "cors" 
// import AuthRoute from "./Routes/Auth.js"
import userRoute from "./Routes/userRoute.js"

const app = express();


app.use(express.static('build')); // Assuming your client-side build is in the 'build' folder

app.get('*', (req, res) => {
  const context = {};
  const helmetContext = {};

  const appMarkup = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  // Use helmet.title, helmet.meta, helmet.link, etc., in your HTML template

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        <!-- Add other head elements as needed -->
      </head>
      <body>
        <div id="root">${appMarkup}</div>
        <!-- Include client-side scripts if needed -->
      </body>
    </html>
  `;

  res.status(200).send(html);
});

app.use(express.static("uploads"))
app.use('/images',express.static("images"))


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