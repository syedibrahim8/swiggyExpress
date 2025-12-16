import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

function authMiddleware(req,res,next){
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(!token) return res.status(400).json({msg:"Access denied"})
        const decode = jwt.verify(token,process.env.SEC_KEY)
        req.user = decode
        next()
    } catch (error) {
        console.log(error);
    }
}
export default authMiddleware