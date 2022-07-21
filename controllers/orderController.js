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
    const orders=await Order.find();
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

/************************Update order */
exports.updateOrder=catchAsyncError(async(req,res,next)=>{
    let order=await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found",400))
    }
    if(order.orderStatus=="Delivered"){
        return next(new ErrorHandler("You have already delivered this product!",400))
    }
    order.orderItems.forEach(async order=>{
        await updateStock(order.product,order.Quantity)
    })
    order.orderStatus=req.body.status;
    if(req.body.status=="Delivered"){
        order.deliveredAt=Date.now();
    }
    let orders=await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        orders
    })

})

async function updateStock(id,quantity){
 const product=await Product.findById(id)
 product.stock-=quantity
 await product.save({validateBeforeSave:false});
}
/*******************************delete order by id */
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found",400))
    }
    await order.remove()
    res.status(200).json({
        success:true.valueOf,
        msg:"Order deleted successfully!"
    })
})
