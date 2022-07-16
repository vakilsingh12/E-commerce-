const mongoose=require('mongoose')
const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then((res)=>{
       console.log("Mongo db connected with server data",res.connection.host)
    })
}
module.exports=connectDatabase