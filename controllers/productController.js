const ErrorHandler = require('../utils/errorHandler');
const Product=require('../models/products')
const catchAsyncError=require('../middleware/catchAsyncError')
const ApiFeatures=require('../utils/apiFeatures')

/* **************create product API --Admin******************* */
exports.createProduct=catchAsyncError(async(req,res,next)=>{
       req.body.user=req.user.id
       const product=await Product.create(req.body);
       res.status(201).json({success:true,product})
})


/* ***************Get all product ************************ */
exports.getAllProducts=catchAsyncError(async(req,res)=>{
    const productCount=await Product.countDocuments();
    const resultPerPage=5;
    const apiFeature=new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    const products=await apiFeature.query    //ye this.query kia hai na class APifeature m is lia esa kia hai
    if(!products){
        return next(new ErrorHandler('Product Not found!'))
    }
    res.status(201).json({
        success:true,
        productCount,
        products
    })
})

/*******************************Update product API --Admin */
exports.updateProduct=catchAsyncError(async(req,res,next)=>{
   let products=await Product.findById(req.params.id)
    if(!products){
        return next(new ErrorHandler('Product not found!',400))
    }
    products=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,
    runValidators:true,
    useFindAndModify:false
    })
    return res.status(200).json({
        success:true,
        products
    })
})

/*****************************Delete products --Admin*/
exports.deleteProduct=catchAsyncError(async(req,res,next)=>{
    let products=await Product.findById(req.params.id)
    if(!products){
        return next(new ErrorHandler('Product not found',400))
    }
    await Product.remove()
    return res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
})

/*******************************get single product detail */
exports.getProductDetail=catchAsyncError(async(req,res,next)=>{
    let product=await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product not found',400))
    }
    return res.status(200).json({
        success:true,
        product
    })
})

/********************create review and update review */
exports.createProductReview=catchAsyncError(async(req,res)=>{
    const {ratings,comments,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        ratings:Number(ratings),
        comments
    }
    const product=await Product.findById(productId);
    const isReviewed=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())
    if(isReviewed){
     product.reviews.forEach(rev=>{
        if(rev.user.toString()===req.user._id.toString())
        rev.ratings=ratings,
        rev.comments=comments
     })
    }else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
    }
    var avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.ratings
    });
    product.ratings=avg/product.reviews.length;
    await product.save();
    res.status(200).json({
        success:true,
    })
})
/****************get all reviews of product */
exports.getProductReview=catchAsyncError(async(req,res)=>{
    const product=await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product not found",400));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})
/************************delete review */
exports.deleteReview=catchAsyncError(async(req,res)=>{
    const product=await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product not found",400));
    }
    const reviews=product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString());
    var avg=0;
    reviews.forEach(rev=>{
        avg+=rev.ratings
    });
    console.log(reviews.length);
    let ratings=avg/product.reviews.length;
    const numOfReviews=reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,numOfReviews,ratings
    },{
        new:true
    })
    res.status(200).json({
        success:true,
    })
})