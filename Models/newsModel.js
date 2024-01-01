import mongoose from "mongoose";
const {ObjectId}=mongoose.Schema;

const newsSchema=mongoose.Schema(
    {
        
        title:String,
        category:String,
        images:[String],
        imagetitle:String,
       
       
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
const NewsModel=mongoose.model("posts",newsSchema)
export default NewsModel