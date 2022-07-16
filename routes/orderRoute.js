const express=require('express');
const { newOrder, getSingleOrder, myOrders } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizesRoles } = require('../middleware/auth')
const router=express.Router();

//*****************************create new order */
router.route('/order/new').post(isAuthenticatedUser,newOrder)
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
router.route("/orders/me").get(isAuthenticatedUser,myOrders)

module.exports=router