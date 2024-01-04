import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
// import dotenv from "dotenv"

// dotenv.config()
// const secret=process.env.JWT_KEY

const authMiddleware=async (req,res,next)=>{
    try {
        // console.log(req.headers,"reqqqqheader")
        const token=req.headers.authorization
        // console.log(token)
        if(!token){
            res.json("token is not available")
        }
        else{
            jwt.verify(token, process.env.JWT_KEY,(err,decoded)=>{
                if(err) return res.json("token is wrong")
                // console.log(decoded,"dec")
                req.body._id=decoded?.id
            next()
            })
            
           

        }
        
    } catch (error) {
        console.log(error)
    }
}
export default authMiddleware