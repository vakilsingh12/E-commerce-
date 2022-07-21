const express=require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizesRoles } = require('../middleware/auth')
const router=express.Router();

//*****************************create new order */
router.route('/order/new').post(isAuthenticatedUser,newOrder)
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
router.route("/orders/me").get(isAuthenticatedUser,myOrders)
router.route('/admin/orders').get(isAuthenticatedUser,authorizesRoles("admin"),getAllOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizesRoles('admin'),updateOrder).delete(isAuthenticatedUser,authorizesRoles('admin'),deleteOrder) 
module.exports=router