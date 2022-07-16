const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require('jsonwebtoken');
const User = require("../models/userModel");
exports.isAuthenticatedUser=catchAsyncError(async(req,res,next)=>{
      let {token}=req.cookies;
      if(!token){
            return next(new ErrorHandler("Please login to access this resource",401))
      }
      const decodedData=jwt.verify(token,process.env.JWT_SECRET)
      req.user=await User.findById(decodedData.id)
      next();
})
exports.authorizesRoles=(...roles)=>{
      return (req,res,next)=>{
            if(!roles.includes(req.user.role)){
                  return next(new ErrorHandler(
                   `Role:${req.user.role} is not allowed to access this resources`,403)
              )
            }
            next();
      }
}