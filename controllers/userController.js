const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError=require('../middleware/catchAsyncError')
const User=require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail=require('../utils/sendEmail')
const crypto=require('crypto');
/******************************************Register a user */
exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const {name,email,password}=req.body;
    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl"
        }
    });
    sendToken(user,201,res);

})
/**************************Login user API */
exports.loginUser=catchAsyncError(async(req,res,next)=>{
       const {email,password}=req.body;
       if(!email||!password){
           return next(new ErrorHandler("Please Enter Email & Password",400))
       }
       const user=await User.findOne({email}).select("+password")
       if(!user){
           return next (new ErrorHandler("Email & password is wrong",401))
       }
       const isPasswordMatched=await user.comparePassword(password);
       console.log(isPasswordMatched)
       if(!isPasswordMatched){
        return next (new ErrorHandler("Email & password is wrong",401))
    }
    sendToken(user,200,res)
})

/****************************Logout user API */
exports.logoutUser=catchAsyncError(async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"logout succcessfully"
    })
})

/**************************forget password**************** */
exports.forgetPassword=catchAsyncError(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler("User not found",404))
    }
    // get resetPassword token
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message=`Your password reset token is :-\n\n ${resetPasswordUrl}\n\nIf you have not requested with this email then,please ignore it`;
    try{
       await sendEmail({
        email:user.email,
        subject:`Ecommerce Password Recovery`,
        message
       })
       return res.status(200).json({
           success:true,
           message:`Email sent to ${user.email} successfully`
       })
    }catch(err){
     user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false})
    return next(new ErrorHandler(err.message,500))
    }
})

/*****************************  reset Password APIs*/
exports.resetPassword=catchAsyncError(async(req,res,next)=>{
    // create token hash
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new ErrorHandler("Reset password token is expired or has been invalid",404))
    }
    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHandler("Password not matched!",400))
    }
    user.password=req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined
    await user.save();
    sendToken(user,200,res)

})

/******************************Get user detail APIs */
exports.getUserDetail=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

/*******************************Update user password APIs */
exports.updatePassword=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password')
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler('Old password is incorrect',400))
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match",400))
    }
    user.password=req.body.newPassword;
    await user.save();
    sendToken(user,200,res)
});
/*************************Update user Profile */
exports.updateProfile=catchAsyncError(async(req,res)=>{
    const {name,email}=req.body;
    const userObj={name,email}
    // for avatar we will add cloudnary later
    await User.findByIdAndUpdate(req.user.id,userObj,{
        new:true
    })
    res.status(200).json({
        success:true,
        msg:"Profile Updated Successfully!"
    })
})

/*************************get user list-->- mean admin can see the details*/
exports.getAllUsers=catchAsyncError(async(req,res)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        result:users
    })
})
/**************************get single user (admin) */
exports.getSingleUser=catchAsyncError(async(req,res)=>{
    const users=await User.findById(req.params.id);
    if(!users){
        return next(new ErrorHandler(`user doesn't exist for this id:${req.params.id}`,400))
    }
    res.status(200).json({
        success:true,
        result:users
    })
})

/*************************Update user Profile and role of user by --admin*/
exports.updateUserRole=catchAsyncError(async(req,res)=>{
    const {name,email,role}=req.body;
    const userObj={name,email,role}
    await User.findByIdAndUpdate(req.user.id,userObj,{
        new:true
    })
    res.status(200).json({
        success:true,
        msg:"Profile Updated Successfully!"
    })
})
/*************************Delete user  by --admin*/
exports.deleteUser=catchAsyncError(async(req,res)=>{
    const user=await User.findById(req.params.id)
    // we will remove cloudnary later
    if(!user){
        return next(new ErrorHandler(`user doesn't exist with this id: ${req.params.id}` ))
    }
    await user.remove();
    res.status(200).json({
        success:true,
        msg:"User Deleted Successfully!"
    })
})