import categoryModel from "../Models/categoryModel.js";
import NewsModel from "../Models/newsModel.js";
import ArticleModel from "../Models/articleModel.js";
import UserModel from "../Models/userModel.js";
import adminModel from "../Models/adminModel.js";
import dotenv from "dotenv"
import timeago from 'timeago.js';



import mongoose from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



dotenv.config()
const serverPublic="https://res.cloudinary.com/dkeb469sv/image/upload/v1703658754/"
export const adminRegister = async (req, res,next) => {
  console.log(req.body,'re')  

   const {firstname, lastname,username} = req.body
        const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
  
    const newAdmin = new adminModel({firstname,lastname,username,password:hashedPass});
    console.log(newAdmin,"new")
  //  const newAdmin= new UserModel({username,password,...req.body});
   // const {username,password,...rest}=new UserModel(req.body)
    
   //const newAdmin={username,password,...rest}

   
  
    try {
    
      const admin = await newAdmin.save();
      console.log(admin,"dad")
  
   
      res.status(200).json({ admin });
    } catch (error) {
      // res.status(500).json({ message: error.message });
   next(error)
    }
  };
export const getadminLogin=async(req,res,next)=>{
  console.log(req.user,"us")
  if(!req.user.email){
    const message = req.query.message || '';
    const admins=req.user.email
      
    res.render('admin/admin-login',{admin:true,admins})
  }

  res.redirect('/admin-news')
}

  export const adminLogin = async (req, res,next) => {
    const { username,password} = req.body;
    console.log(req.body,"re")
  
    try {
      const admin = await adminModel.findOne({username});
      console.log(admin);
  
      if (admin) {
        const validity = await bcrypt.compare(password, admin.password);
  
        if (!validity) {
          // res.status(400).json("Wrong password");
          res.redirect('/admin?message=Invalid%20username%20or%20password');
        } else {
          const token = jwt.sign(
            {
                email: admin.username,
              id: admin._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
          );
   
          res.cookie('token', token);

          // Redirect to the add-news page on successful login
          res.redirect('/admin-news');
          
          // res.status(200).json({admin,token });
        }
      } else {
        // res.status(404).json("User does not exists");
        res.render('admin/admin-login', { message: 'Invalid username' })
      }
    } catch (error) {
      // res.status(500).json({ message: error.message });
    next(error)
    }
  };

  export const getAdmin=async(req,res,next)=>{
    const category = await categoryModel.find().exec()
    const admins=req.user.email

    res.render('admin/addnews',{category,admin:true,admins})
  }
//create new post

export const addNews= async(req,res,next)=>{
  console.log("som")
 
  console.log(req.body,"req")
    const { _id,title,subtitle, category, date, body ,imagetitle1,imagetitle2,secondparagraph,thirdparagraph} = req.body;
    
    const dateString = date
    
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toLocaleDateString();
  // console.log(formattedDate,"date")

  
    const imageFiles = req.files;
    console.log(imageFiles,'idm')

    // Create a new NewsModel instance with the extracted data
    const newNews = new NewsModel({
      title,
      subtitle,
      category,
      date:formattedDate,
      body,
      image1: imageFiles['image1'][0].filename, // Get the filename for image1
      image2: imageFiles['image2'][0].filename, // Get the filename for image2
      images: imageFiles['images'].map(file => file.filename), 
      imagetitle1,
      imagetitle2,
      secondparagraph,
      thirdparagraph
    });

    try {
        await newNews.save()
        res.redirect('/admin-news')
        // res.status(200).json(newNews)
    } catch (error) {
        // res.status(500).json(error)
        console.log(error,'erer')
 next(error)

    }
}

// export const addArticles= async(req,res)=>{
//   console.log(req.body,'reqqhy')
//     const { title, category, date, body ,imagetitle,secondparagraph} = req.body;
//     const dateString = date
    
//   const dateObject = new Date(dateString);
//   const formattedDate = dateObject.toLocaleDateString();

   
//     const imageFiles = req.files;

//     // Create a new NewsModel instance with the extracted data
//     const newNews = new ArticleModel({
//       title,
//       category,
//       date:formattedDate,
//       body,
//       images: imageFiles.map((file) => file.filename),
//       imagetitle,
//       secondparagraph
//     });

//     try {
//         await newNews.save()
//         res.status(200).json(newNews)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// }

// export const getArticles=async(req,res)=>{
//     try {
//         const news=await ArticleModel.find().sort({ createdAt: -1 }).limit(4).exec()
       
       
//        return res.status(200).json(news)
//     } catch (error) {
//         console.log(error,'ere')
//     }
// }

export const addCategory=async(req,res,next)=>{
    console.log(req.body,"xd")
    const cat= new categoryModel(req.body)
    const {category}=req.body
   
    try {
        const catExists = await categoryModel.findOne({ cat });
        if(catExists){
            res.status(500).json("already exists")
        }
        await cat.save()
        res.redirect('/categories')
        // res.status(200).json(cat)
    } catch (error) {
        // res.status(500).json(error)
   next(error)

        
    }
}

export const getCategory=async(req,res,next)=>{
    try {
        
        const catDetails = await categoryModel.find().exec()
      
        const admins=req.user.email
    res.render('admin/categorypage',{catDetails,admin:true,admins})
      // return res.status(200).json(catDetails)
    } catch (error) {
   next(error)
        
    }

}

 //logout functions
 export const adminLogout=async(req,res)=>{
  res.clearCookie('token')
  res.redirect('/admin')
 }


//creating a function to return the html based on the route


