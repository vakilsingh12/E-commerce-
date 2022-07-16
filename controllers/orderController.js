const Order=require('../models/orderModel');
const Product=require('../models/products');
const ErrorHandler = require('../utils/errorHandler');
const ApiFeatures=require('../utils/apiFeatures')
const catchAsyncError=require('../middleware/catchAsyncError')

//*********************************Create new order */
exports.newOrder=catchAsyncError(async(req,res)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    }=req.body;
    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })
    res.status(201).json({
        success:true,
        order
    })
})

/**************************get single order loggind in user */
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email")
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404))
    }
    res.status(200).json({
        success:true
        ,order
    })
})

/**********************loged in order */
exports.myOrders=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id})
    res.status(200).json({
        success:true
        ,orders
    })
})

/*******************get All orders --Admin */
exports.getAllOrders=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find()
    res.status(200).json({
        success:true
        ,orders
    })
})