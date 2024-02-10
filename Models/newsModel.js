import mongoose from "mongoose";
const {ObjectId}=mongoose.Schema;
import {marked} from 'marked'
// import slugify from "slugify";
import speakingurl from 'speakingurl';
// import slugify from 'slug';
// import { slugify,slugifyUrl } from "transliteration";
import { slugify } from 'transliteration';

const newsSchema=mongoose.Schema(
    {
        
        title: String,
        subtitle:String,
        category:String,
        image1:String,
        image2:String,
        images:[String],
        imagetitle1:String,
        imagetitle2:String,
      
       
            date:String,
            body:String,
            secondparagraph:String,
            thirdparagraph:String,
         

        // reports working
        reports:{
            type: Array,
            default: [],
          },
          reportcount:{
            type:Number,
            default:0
          },
          slug:{
            type:String,
            required:true,
            unique:true
          }

   
    },
    {
        timestamps:true
    }
)
newsSchema.pre('validate',function(next){
    if(this.title){
        const kannadaTitle = this.title;
 this.slug = slugify(kannadaTitle, { lowercase: true });
// console.log(slug,"sofd");
    }
    next()
})
const NewsModel=mongoose.model("posts",newsSchema)
export default NewsModel