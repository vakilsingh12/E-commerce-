const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const productSchema=new Schema({
     name:{
         type:String,
         required:[true,"Please enter product name"],
         trim:true
     },
     description:{
         type:String,
         required:[true,"Please enter product description"]
     },
     price:{
         type:Number,
         required:[true,"Please enter products price"],
         maxlength:[8,"Price cannot exceed 8 charcters"]
     },
     ratings:{
         type:Number,
         default:0
     },
     images:[
         {
            public_id:{
                type:String,
                required:true
            },
            url:{
               type:String,
               required:true
           }
         }
    ],
    category:{
        type:String,
        required:[true,"Please enter product category"],
    },
    stock:{
        type:String,
        required:[true,"Please enter product stock"],
        maxlength:[4,"Stock cannot exceed 4 charcters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                required:true
            },
            ratings:{
                type:Number,
                required:true
            },
            comments:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=new mongoose.model('Products',productSchema)