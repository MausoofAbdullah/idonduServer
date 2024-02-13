import express from "express"
import {addCategory, addNews, getCategory,adminRegister,adminLogin,
  getAdmin,getadminLogin,adminLogout} from "../controllers/AdminController.js"

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
       // Add compression settings
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' }, // Example: Resize to maximum 1000x1000
      { quality: 'auto', fetch_format: 'auto' } // Enable automatic quality and format optimization
    ],
      // You can add more Cloudinary parameters as needed
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB limit (adjust as needed)
    },
  });
  const multipleupload=upload.fields([{name:'image1'},{name:"image2"},{name:"images",maxCount:5}])
 
router.get('/',authMiddleware,getadminLogin)
router.post('/admin',adminLogin)
router.get('/admin-news',authMiddleware,getAdmin)
// router.get('/admin-news',authMiddleware,getAdmin)
router.post('/admin-addnews',authMiddleware,multipleupload,addNews)
// router.post('/addarticles',upload.array('images', 5),addArticles)
// router.get('/',getNews)
// router.get('/article',getArticles)
router.post('/categories',authMiddleware,addCategory)
router.get('/categories',authMiddleware,getCategory)
// router.get('/detailnews/:id',getDetailnews)

router.post('/register',adminRegister)
router.post('/login',adminLogin)
router.get('/logout',adminLogout)



export default router
