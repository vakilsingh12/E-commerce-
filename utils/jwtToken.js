const sendToken=(user,statusCode,res)=>{
    const token=user.getJwtToken()
    // option for cookie
    let options={
        httpOnly:true,
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
        )
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
    })
}
module.exports=sendToken