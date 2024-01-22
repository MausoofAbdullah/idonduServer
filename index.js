import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer"
import dotenv from "dotenv";
import path from "path"
import hbs from "express-handlebars"
import handlebars from "handlebars"


import cheerio from "cheerio"
import prerender from "prerender-node"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import puppeteer from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import { promisify } from "util";
import request from "request";
import getUrls from "get-urls";

const requestPromise = promisify(request);

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
// import dotenv from "dotenv";
import cors from "cors" 
// import AuthRoute from "./Routes/Auth.js"
import userRoute from "./Routes/userRoute.js"
// import { defaultTo } from "lodash";

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({helpers:{inc:function(value,options){return parseInt(value)+1;}},
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
app.use(cors());
dotenv.config();

const urlImageIsAccessible = async url => {
  const correctedUrls = getUrls(url);
  if (correctedUrls.size !== 0) {
    const urlResponse = await request(correctedUrls.values().next().value);
    const contentType = urlResponse.headers["content-type"];
    return new RegExp("image/*").test(contentType);
  }
};

const getImg = async (page, uri) => {
  const img = await page.evaluate(async () => {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (
      ogImg != null &&
      ogImg.content.length > 0 &&
      (await urlImageIsAccessible(ogImg.content))
    ) {
      return ogImg.content;
    }
    const imgRelLink = document.querySelector('link[rel="image_src"]');
    if (
      imgRelLink != null &&
      imgRelLink.href.length > 0 &&
      (await urlImageIsAccessible(imgRelLink.href))
    ) {
      return imgRelLink.href;
    }
    const twitterImg = document.querySelector('meta[name="twitter:image"]');
    if (
      twitterImg != null &&
      twitterImg.content.length > 0 &&
      (await urlImageIsAccessible(twitterImg.content))
    ) {
      return twitterImg.content;
    }

    let imgs = Array.from(document.getElementsByTagName("img"));
    if (imgs.length > 0) {
      imgs = imgs.filter(img => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else {
          if (img.naturalHeight / img.naturalWidth > 3) {
            addImg = false;
          }
        }
        if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
          addImg = false;
        }
        return addImg;
      });
      imgs.forEach(img =>
        img.src.indexOf("//") === -1
          ? (img.src = `${new URL(uri).origin}/${src}`)
          : img.src
      );
      return imgs[0].src;
    }
    return null;
  });
  return img;
};

const getTitle = async page => {
  const title = await page.evaluate(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle != null && ogTitle.content.length > 0) {
      return ogTitle.content;
    }
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle != null && twitterTitle.content.length > 0) {
      return twitterTitle.content;
    }
    const docTitle = document.title;
    if (docTitle != null && docTitle.length > 0) {
      return docTitle;
    }
    const h1 = document.querySelector("h1").innerHTML;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    const h2 = document.querySelector("h1").innerHTML;
    if (h2 != null && h2.length > 0) {
      return h2;
    }
    return null;
  });
  return title;
};

const getDescription = async page => {
  const description = await page.evaluate(() => {
    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription != null && ogDescription.content.length > 0) {
      return ogDescription.content;
    }
    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (twitterDescription != null && twitterDescription.content.length > 0) {
      return twitterDescription.content;
    }
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription != null && metaDescription.content.length > 0) {
      return metaDescription.content;
    }
    paragraphs = document.querySelectorAll("p");
    let fstVisibleParagraph = null;
    for (let i = 0; i < paragraphs.length; i++) {
      if (
        // if object is visible in dom
        paragraphs[i].offsetParent !== null &&
        !paragraphs[i].childElementCount != 0
      ) {
        fstVisibleParagraph = paragraphs[i].textContent;
        break;
      }
    }
    return fstVisibleParagraph;
  });
  return description;
};

const getDomainName = async (page, uri) => {
  const domainName = await page.evaluate(() => {
    const canonicalLink = document.querySelector("link[rel=canonical]");
    if (canonicalLink != null && canonicalLink.href.length > 0) {
      return canonicalLink.href;
    }
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
      return ogUrlMeta.content;
    }
    return null;
  });
  return domainName != null
    ? new URL(domainName).hostname.replace("www.", "")
    : new URL(uri).hostname.replace("www.", "");
};

export default async function fetchData (
  uri,
  puppeteerArgs = [],
  puppeteerAgent = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
) {
  puppeteer.use(pluginStealth());
  const browser = await puppeteer.launch({
    headless: true,
    args: [...puppeteerArgs]
  });
  const page = await browser.newPage();
  page.setUserAgent(puppeteerAgent);

  await page.goto(uri);
  await page.exposeFunction("request", request);
  await page.exposeFunction("urlImageIsAccessible", urlImageIsAccessible);

  const obj = {};
  obj.title = await getTitle(page);
  obj.description = await getDescription(page);
  obj.domain = await getDomainName(page, uri);
  obj.img = await getImg(page, uri);

  await browser.close();
  return obj;
};




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

//   app.use('/auth',AuthRoute)
  app.use('/',userRoute)
 