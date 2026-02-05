import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

export const authMiddleware=asyncHandler(async (req,res,next)=>{
    const accessToken=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
    
    if(!accessToken){
        throw new ApiError(401,"unauthorised access")
    }

    const token=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    
    const user=await User.findById(token._id)

    if(!user){
        throw new ApiError(401,"Invalid Access Token")
    }

    req.user=user
    
    next()
})