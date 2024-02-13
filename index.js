import createError from "http-errors"
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer"
import dotenv from "dotenv";
import path from "path"
import hbs from "express-handlebars"
import handlebars from "handlebars"
import cookieParser from "cookie-parser";


import cheerio from "cheerio"
import prerender from "prerender-node"
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





// Register a helper for comparison in Handlebars
handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
      case '==':
          return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
          return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '!==':
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
          return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
          return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});
handlebars.registerHelper('isEqual', function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
  
});
handlebars.registerHelper('isSecondImage', function(index, options) {
  return index === 1 ? options.fn(this) : options.inverse(this);
});

// import dotenv from "dotenv";
import cors from "cors" 
// import AuthRoute from "./Routes/Auth.js"
import adminRoute from "./Routes/adminRoute.js"
import newsRoute from "./Routes/newsRoute.js"

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({helpers:{inc:function(value,options){return parseInt(value)+1;}, gt: function (a, b) {
  return a > b;
}, lt: function (a, b) {
  return a < b;
},
add: function (a, b) {
  return a + b;
},    eq: function (a, b) {
  return a === b;
}},
extname:'hbs',defaultLayout:'user-layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/',
 runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true,},}));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   prerender.set("prerenderToken", ["LJQq3UXZJOXRCIhol4oI"])
//   );
app.use(express.static("uploads"))
app.use('/images',express.static("images"))
app.use(prerender.set('protocol', 'https'));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(cors());
dotenv.config();


//   app.use('/auth',AuthRoute)
  app.use('/admin',adminRoute)
  app.use('/',newsRoute)
  app.use((req, res, next) => {
    const error = new Error("Not found the page");
    error.status = 404;
    next(error);
  });
     // error handler middleware
     app.use((error, req, res, next) => {
    res.render('user/error',{ message:error.message || 'Internal Server Error'})
    });


const PORT=3000
mongoose
  .connect(process.env.MONGO_DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    

  });

  
