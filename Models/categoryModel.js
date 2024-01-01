import mongoose from "mongoose";
const {ObjectId}=mongoose.Schema;

const categorySchema=mongoose.Schema(
    {
        
        category:String,
       
       
       
        
         

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
const categoryModel=mongoose.model("category",categorySchema)
export default categoryModel