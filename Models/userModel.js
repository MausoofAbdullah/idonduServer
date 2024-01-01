import mongoose from "mongoose";

const UserSchema=mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
     
        password:{
            type:String,
            required:true
        },
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        isLogin:{
            type:Boolean,
            default:false
        }
       
        
 
    },
    {timestamps:true}
)

const UserModel=mongoose.model("users",UserSchema)
export default UserModel