const app=require('./app')
const dotenv=require('dotenv')
dotenv.config({path:'./config/config.env'})
// Handling uncaught error
// ex: consoloe.log(youtube) so youtube is not defined here 
process.on('uncaughtException',(err)=>{
      console.log(`Error:${err.message}`)
      console.log('shutting down the server due to uncaught exception')
      process.exit(1)
})
// Database connection
const connectDatabase=require('./config/database')
connectDatabase()


const server=app.listen(process.env.PORT,()=>{
   console.log(`server is workinng on port ${process.env.PORT}`)
})

/**************************unhandled promise reection */
process.on('unhandledRejection',err=>{
   console.log(`Error:${err.message}`);
   console.log('Shutting down the server due to unhandled promise rejection')
   server.close(()=>{
      process.exit(1);
   })
})