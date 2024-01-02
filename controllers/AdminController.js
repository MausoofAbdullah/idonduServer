import categoryModel from "../Models/categoryModel.js";
import NewsModel from "../Models/newsModel.js";
import ArticleModel from "../Models/articleModel.js";
import UserModel from "../Models/userModel.js";
import dotenv from "dotenv"


import mongoose from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config()
export const adminRegister = async (req, res) => {
  console.log(req.body,'re')  

   const {firstname, lastname,username} = req.body
        const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
  
    const newAdmin = new UserModel({firstname,lastname,username,password:hashedPass});
    console.log(newAdmin,"new")
  //  const newAdmin= new UserModel({username,password,...req.body});
   // const {username,password,...rest}=new UserModel(req.body)
    
   //const newAdmin={username,password,...rest}

   
  
    try {
    
      const admin = await newAdmin.save();
      console.log(admin,"dad")
  
      // const token = jwt.sign(
      //   {
      //     firstname: admin.firstname,
      //     id: admin._id,
      //   },
      //   process.env.JWT_KEY,
      //   { expiresIn: "1h" }
      // );
      res.status(200).json({ admin });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const adminLogin = async (req, res) => {
    const { username,password} = req.body;
    console.log(req.body,"re")
  
    try {
      const admin = await UserModel.findOne({username});
      // console.log(admin);
  
      if (admin) {
        const validity = await bcrypt.compare(password, admin.password);
  
        if (!validity) {
          res.status(400).json("Wrong password");
        } else {
          const token = jwt.sign(
            {
                email: admin.username,
              id: admin._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
        // const user=await UserModel.findById(admin._id)
  //  const newAdmin= await admin.updateOne({ $set: { isLogin: true } });
   
          
          res.status(200).json({admin,token });
        }
      } else {
        res.status(404).json("User does not exists");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
//create new post

export const addNews= async(req,res)=>{
 
    const { _id,title, category, date, body ,imagetitle,secondparagraph} = req.body;
    console.log(_id,"dfd")
    const dateString = date
    
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toLocaleDateString();

   
    const imageFiles = req.files;

    // Create a new NewsModel instance with the extracted data
    const newNews = new NewsModel({
      title,
      category,
      date:formattedDate,
      body,
      images: imageFiles.map((file) => file.filename),
      imagetitle,
      secondparagraph
    });

    try {
        await newNews.save()
        res.status(200).json(newNews)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const addArticles= async(req,res)=>{
  console.log(req.body,'reqqhy')
    const { title, category, date, body ,imagetitle,secondparagraph} = req.body;
    const dateString = date
    
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toLocaleDateString();

   
    const imageFiles = req.files;

    // Create a new NewsModel instance with the extracted data
    const newNews = new ArticleModel({
      title,
      category,
      date:formattedDate,
      body,
      images: imageFiles.map((file) => file.filename),
      imagetitle,
      secondparagraph
    });

    try {
        await newNews.save()
        res.status(200).json(newNews)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getNews=async(req,res)=>{
    try {
        const news=await NewsModel.find().sort({ createdAt: -1 }).exec()
        
       return res.status(200).json(news)
    } catch (error) {
        console.log(error,'ere')
    }
}
export const getArticles=async(req,res)=>{
    try {
        const news=await ArticleModel.find().sort({ createdAt: -1 }).limit(4).exec()
        console.log(news,"why")
        
       return res.status(200).json(news)
    } catch (error) {
        console.log(error,'ere')
    }
}

export const addCategory=async(req,res)=>{
    
    const cat= new categoryModel(req.body)
    const {category}=req.body
   
    try {
        const catExists = await categoryModel.findOne({ cat });
        if(catExists){
            res.status(500).json("already exists")
        }
        await cat.save()
        res.status(200).json(cat)
    } catch (error) {
        res.status(500).json(error)
        
    }
}

export const getCategory=async(req,res)=>{
    try {
        
        const catDetails = await categoryModel.find().exec()
        console.log(catDetails,"catwy")
    
      return res.status(200).json(catDetails)
    } catch (error) {
        
    }

}

export const getDetailnews=async(req,res)=>{
    try {
        const { id } = req.params;
        console.log("check")
        console.log(id,"id")
        // console.log(id,"id")
        const news = await NewsModel.findById(id);
        console.log(news,"check req")
        if (!news) {
          return res.status(404).json({
            message: "no blogs for this user",
          });
        }
        return res.status(200).json(
          
          news
        );
      } catch (error) {
        return res.status(400).json({
          message: "error while getting single blog",
          error,
        });
      }
}





