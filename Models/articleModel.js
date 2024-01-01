import mongoose from "mongoose";
const {ObjectId}=mongoose.Schema;

const articleSchema=mongoose.Schema(
    {
        
        title:String,
        category:String,
        images:[String],
        authorName:String,
       
       
            date:String,
            body:String,
            secondparagraph:String
         

        //reports working
        // reports:{
        //     type: Array,
        //     default: [],
        //   },
        //   reportcount:{
        //     type:Number,
        //     default:0
        //   }

   
    },
    {
        timestamps:true
    }
)
const ArticleModel=mongoose.model("articles",articleSchema)
export default ArticleModel