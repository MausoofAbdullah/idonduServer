import categoryModel from "../Models/categoryModel.js";
import NewsModel from "../Models/newsModel.js";
import ArticleModel from "../Models/articleModel.js";
import UserModel from "../Models/userModel.js";
import dotenv from "dotenv"
import timeago from 'timeago.js';
import moment from 'moment'


const serverPublic="https://res.cloudinary.com/dkeb469sv/image/upload/v1703658754/"






export const getNews=async(req,res,next)=>{
    
    const currentPath = req.path;
    const cDate = moment();
    const currentDate = cDate.format('MMMM DD dddd YYYY')
    
    
    
    try {
        // throw new Error("Something went wrong!");
      const perPage = 6;
      const page = req.query.page || 1;
        const news=await NewsModel.find().sort({ createdAt: -1 }).skip((page - 1) * perPage) .limit(perPage).exec()
        const allnews=await NewsModel.find().sort({ createdAt: -1 }).limit(10).exec()

       
        const category = await categoryModel.find().exec()
        
        const totalNewsCount = await NewsModel.countDocuments();
        const totalPages = Math.ceil(totalNewsCount / perPage);

        
 
        const formattedNews = news.map((item) => {
          return {
              ...item.toObject(),
              timeAgo: timeago.format(item.createdAt),
              
          };
      });
      formattedNews.forEach(newsItem => {
        newsItem.shortp = truncateToWords(newsItem.body);
      });
    

        function truncateToWords(str) {
          // const words = str.split(/\s+/);
          const truncatedWords = str.slice(0 , 200);
          
          return truncatedWords;
        }
    
    


function truncateToThreeWords(str) {
  

  // Truncate to three words
  const truncatedString = str.slice(0, 150)

  return truncatedString;

}
const previousPage = Math.max(1, page - 1);
const nextPage = Math.max(1, page + 1);

    // Pagination for trending news
    const trendingPerPage = 4; // Set the number of trending news items per page
    const trendingPage = req.query.trendingPage || 1;

    const trendingNews = await NewsModel.find()
        .sort({ createdAt: -1 })
        .skip((trendingPage - 1) * trendingPerPage)
        .limit(trendingPerPage)
        .exec();

    const trendingTotalCount = await NewsModel.countDocuments();
    const trendingTotalPages = Math.ceil(trendingTotalCount / trendingPerPage);


    const previousNews = await NewsModel.findOne({ createdAt: { $lt: news.createdAt } }).sort({ createdAt: -1 }).exec() ||await NewsModel.findOne().sort({ createdAt: -1 }).exec();
      

    // Get the next news
    const nextNews = await NewsModel.findOne({ createdAt: { $gt: news.createdAt } }).sort({ createdAt: 1 }).exec() || await NewsModel.findOne().sort({ createdAt: 1 }).exec();

    

        res.render('user/newsHome',{user:true,news:formattedNews,allnews,previousNews,nextNews,category,totalPages, page ,previousPage,nextPage, trendingNews, trendingTotalPages, trendingPage,currentPath,currentDate})
        
      //  return res.status(200).json(news)
    } catch (error) {
        console.log(error,"errrr")
        // res.status(error.status || 500).send({
        //     error: {
        //       status: error.status || 500,
        //       message: error.message || "Internal Server Error",
        //     },
        //   });
        next(error)
    }
}



export const getDetailnews=async(req,res,next)=>{
    try {
        const { id } = req.params;
        const {slug} =req.params
        const page = req.query.page || 1;
        const cDate = moment();
        const currentDate = cDate.format('MMMM DD dddd YYYY')
       
        
        // console.log(id,"id")
        const news = await NewsModel.findOne({slug:slug});
        news.shortD=truncateBody(news.body);
        function truncateBody(str) {
            // const words = str.split(/\s+/);
            const truncatedWords = str.slice(0, 80);
            
            return truncatedWords;
          }

        // const fullNews=await NewsModel.find().sort({ createdAt: -1 }).limit(4).exec()

        const timead=timeago.format(news.createdAt);
       
      
        //   news.shortp = truncateToWords(news.body);
        

        // function truncateToWords(str) {
        //   // const words = str.split(/\s+/);
        //   const truncatedWords = str.slice(0, 100);
          
        //   return truncatedWords;
        // }
        
    
        const previousNews = await NewsModel.findOne({ createdAt: { $lt: news.createdAt } }).sort({ createdAt: -1 }).exec() ||await NewsModel.findOne().sort({ createdAt: -1 }).exec();
        previousNews.shortp = truncateToWords(previousNews.title);
        


        // Get the next news
        const nextNews = await NewsModel.findOne({ createdAt: { $gt: news.createdAt } }).sort({ createdAt: 1 }).exec() || await NewsModel.findOne().sort({ createdAt: 1 }).exec();
      
      
      const img=news.images
      console.log(img,"imd")


      nextNews.shortp = truncateToWords(nextNews.title);
        

      function truncateToWords(str) {
        // const words = str.split(/\s+/);
        const truncatedWords = str.slice(0, 80);
        
        return truncatedWords;
      }
       
        if (!news) {
          
          return res.status(404).json({
            message: "no blogs for this user",
          });
        }
           
   // Pagination for trending news
   const previousPage = Math.max(1, page - 1);
const nextPage = Math.max(1, page + 1);
   const trendingPerPage = 4; // Set the number of trending news items per page
   const trendingPage = req.query.trendingPage || 1;

   const trendingNews = await NewsModel.find()
       .sort({ createdAt: -1 })
       .skip((trendingPage - 1) * trendingPerPage)
       .limit(trendingPerPage)
       .exec();
       trendingNews.forEach(newsItem => {
        newsItem.shortp = truncateToWords(newsItem.title);
      });
   const trendingTotalCount = await NewsModel.countDocuments();
   const trendingTotalPages = Math.ceil(trendingTotalCount / trendingPerPage);
   const allnews=await NewsModel.find().sort({ createdAt: -1 }).limit().exec()
   
        res.render('user/singlePage',{user:true,news,img,previousNews,nextNews,timead,currentDate,allnews, trendingNews, trendingTotalPages, trendingPage,previousPage,nextPage})

        // return res.status(200).json(news);
      } catch (error) {
        // console.log(error,"errrrr")
        // return res.status(400).json({
        //   message: "error while getting single blog",
        //   error,
        // });
     next(error)

      }
  
}


export const getCategorynews=async(req,res,next)=>{
   
    const cDate = moment();
    const currentDate = cDate.format('MMMM DD dddd YYYY')
    try {
        
        let category = req.query.category;
      
        const currentPath = req.path;
        const perPage = 6;
        const page = req.query.page || 1;
          const cnews=await NewsModel.find({ category }).sort({ createdAt: -1 }).skip((page - 1) * perPage) .limit(perPage).exec()
          console.log(cnews,"ddfd")
          
          
        const news=await NewsModel.find().sort({ createdAt: -1 }).skip((page - 1) * perPage) .limit(perPage).exec()
         
          const showCategory= await categoryModel.find().exec()
          
          const totalNewsCount = await NewsModel.countDocuments();
          const totalPages = Math.ceil(totalNewsCount / perPage);
  
          cnews.forEach(newsItem => {
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
      
      
  
  
  function truncateToThreeWords(str) {
    
  
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
  
      
  
          res.render('user/category',{user:true,news:formattedNews,category,totalPages, page ,previousPage,nextPage, trendingNews, trendingTotalPages, trendingPage,currentPath,currentDate,cnews})
          
        //  return res.status(200).json(news)
      } catch (error) {
          next(error)
          console.log(error,'ere')

      }
}
