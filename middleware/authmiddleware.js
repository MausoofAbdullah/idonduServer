import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
// import dotenv from "dotenv"

// dotenv.config()
// const secret=process.env.JWT_KEY

const authMiddleware=async (req,res,next)=>{
    try {
        // console.log(req.headers,"reqqqqheader")
        // const token=req.headers.authorization
        // // console.log(token)
        // if(!token){
        //     res.json("token is not available")
        // }
        // else{
        //     jwt.verify(token, process.env.JWT_KEY,(err,decoded)=>{
        //         if(err) return res.json("token is wrong")
        //         // console.log(decoded,"dec")
        //         req.body._id=decoded?.id
        //     next()
        //     })
            
           

        // }

        const token = req.cookies.token;

        if (!token) {
          // Redirect to the login page or handle unauthorized access as needed
          return res.render('admin/admin-login',{admin:true,message:"pleaselogin"});
        }
      
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
          if (err) {
            // Invalid token, redirect to login page or handle unauthorized access
            return res.redirect('/admin?message=Unauthorized');
          }
      
          req.user = user;
          next();
        });
        
    } catch (error) {
        console.log(error)
    }
}
export default authMiddleware