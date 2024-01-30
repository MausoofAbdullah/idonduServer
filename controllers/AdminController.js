import categoryModel from "../Models/categoryModel.js";
import NewsModel from "../Models/newsModel.js";
import ArticleModel from "../Models/articleModel.js";
import UserModel from "../Models/userModel.js";
import dotenv from "dotenv"
import timeago from 'timeago.js';



import mongoose from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


dotenv.config()
const serverPublic="https://res.cloudinary.com/dkeb469sv/image/upload/v1703658754/"
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

  export const getAdmin=async(req,res)=>{
    const category = await categoryModel.find().exec()

    res.render('admin/addnews',{category})
  }
//create new post

export const addNews= async(req,res)=>{
 
  console.log(req.body,"req")
    const { _id,title,subtitle, category, date, body ,imagetitle1,imagetitle2,secondparagraph,thirdparagraph} = req.body;
    
    const dateString = date
    
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toLocaleDateString();
  // console.log(formattedDate,"date")

   
    const imageFiles = req.files;

    // Create a new NewsModel instance with the extracted data
    const newNews = new NewsModel({
      title,
      subtitle,
      category,
      date:formattedDate,
      body,
      images: imageFiles.map((file) => file.filename),
      imagetitle1,
      imagetitle2,
      secondparagraph,
      thirdparagraph
    });

    try {
        await newNews.save()
        res.redirect('/admin')
        // res.status(200).json(newNews)
    } catch (error) {
        res.status(500).json(error)
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

export const getNews=async(req,res)=>{
  
    try {
      const perPage = 6;
      const page = req.query.page || 1;
        const news=await NewsModel.find().sort({ createdAt: -1 }).skip((page - 1) * perPage) .limit(perPage).exec()
       
        const category = await categoryModel.find().exec()
        const totalNewsCount = await NewsModel.countDocuments();
        const totalPages = Math.ceil(totalNewsCount / perPage);

        news.forEach(newsItem => {
          newsItem.shortp = truncateToWords(newsItem.body);
        });
 
        const formattedNews = news.map((item) => {
          return {
              ...item.toObject(),
              timeAgo: timeago.format(item.createdAt),
          };
      });
    

        function truncateToWords(str) {
          // const words = str.split(/\s+/);
          const truncatedWords = str.slice(0 , 100);
          
          return truncatedWords;
        }
      
      //   const words=news.map((we)=>{
      //     return we.body
      //   })
      //  console.log(words,"ew")
    
// const truncatedArray = words.map(string => truncateToThreeWords(string));

function truncateToThreeWords(str) {
  // Split the string into words
  // const words = str.split(/\s+/);

  // Truncate to three words
  const truncatedString = str.slice(0, 150)

  return truncatedString;

}
const previousPage = Math.max(1, page - 1);
const nextPage = Math.max(1, page + 1);

    // Pagination for trending news
    const trendingPerPage = 6; // Set the number of trending news items per page
    const trendingPage = req.query.trendingPage || 1;

    const trendingNews = await NewsModel.find()
        .sort({ createdAt: -1 })
        .skip((trendingPage - 1) * trendingPerPage)
        .limit(trendingPerPage)
        .exec();

    const trendingTotalCount = await NewsModel.countDocuments();
    const trendingTotalPages = Math.ceil(trendingTotalCount / trendingPerPage);

    

        res.render('user/newsHome',{user:true,news:formattedNews,category,totalPages, page ,previousPage,nextPage, trendingNews, trendingTotalPages, trendingPage})
        
      //  return res.status(200).json(news)
    } catch (error) {
        console.log(error,'ere')
    }
}

// export const getArticles=async(req,res)=>{
//     try {
//         const news=await ArticleModel.find().sort({ createdAt: -1 }).limit(4).exec()
       
       
//        return res.status(200).json(news)
//     } catch (error) {
//         console.log(error,'ere')
//     }
// }

export const addCategory=async(req,res)=>{
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
        res.status(500).json(error)
        
    }
}

export const getCategory=async(req,res)=>{
    try {
        
        const catDetails = await categoryModel.find().exec()
        console.log(catDetails,"catwy")
    res.render('admin/categorypage',{catDetails})
      // return res.status(200).json(catDetails)
    } catch (error) {
        
    }

}

export const getDetailnews=async(req,res)=>{
    try {
        const { id } = req.params;
       
        
        // console.log(id,"id")
        const news = await NewsModel.findById(id);
        const fullNews=await NewsModel.find().sort({ createdAt: -1 }).limit(6).exec()

        const timead=timeago.format(news.createdAt);
       
      
          news.shortp = truncateToWords(news.body);
        

        function truncateToWords(str) {
          // const words = str.split(/\s+/);
          const truncatedWords = str.slice(0, 100);
          
          return truncatedWords;
        }
        
    
        const previousNews = await NewsModel.findOne({ createdAt: { $lt: news.createdAt } }).sort({ createdAt: -1 }).exec() ||await NewsModel.findOne().sort({ createdAt: -1 }).exec();
      

        // Get the next news
        const nextNews = await NewsModel.findOne({ createdAt: { $gt: news.createdAt } }).sort({ createdAt: 1 }).exec() || await NewsModel.findOne().sort({ createdAt: 1 }).exec();
      
      
      const img=news.images

     
       
        if (!news) {
          
          return res.status(404).json({
            message: "no blogs for this user",
          });
        }
           
  
        res.render('user/singlePage',{user:true,news,fullNews,img,previousNews,nextNews,timead})

        // return res.status(200).json(news);
      } catch (error) {
        console.log(error,"errrrr")
        return res.status(400).json({
          message: "error while getting single blog",
          error,
        });
      }
      // function generateOGPTags(news) {
      //   return `
      //       <meta property="og:title" content="${news.title}">
      //       <meta property="og:description" content="${news.body.slice(1, 150)}">
      //       <meta property="og:image" content="${serverPublic+news.images?.[0]}">
      //   `;
      // }
}


//creating a function to return the html based on the route


