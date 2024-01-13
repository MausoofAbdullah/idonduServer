import express from "express"
import {addCategory, addNews, getCategory,getNews,getDetailnews,addArticles,
  getArticles,adminRegister,adminLogin,
  getAdmin} from "../controllers/AdminController.js"

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary';
import multer from "multer"

import dotenv from "dotenv";

import path from 'path'
import authMiddleware from "../middleware/authmiddleware.js";
dotenv.config();

const router=express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

// Set up multer storage and limits
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/images'); // Set your upload directory
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     },
//   });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'news', // Set your desired folder in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png'],
      // You can add more Cloudinary parameters as needed
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB limit (adjust as needed)
    },
  });
  console.log(upload,"up")
// router.get('/',)
router.get('/admin',getAdmin)
router.post('/admin',upload.array('images', 5),addNews)
router.post('/addarticles',upload.array('images', 5),addArticles)
router.get('/',getNews)
router.get('/article',getArticles)
router.post('/categories',addCategory)
router.get('/categories',getCategory)
router.get('/detailnews/:id',getDetailnews)

router.post('/register',adminRegister)
router.post('/login',adminLogin)



export default router
