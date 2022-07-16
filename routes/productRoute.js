const express=require('express')
const  {getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetail,createProductReview, getProductReview, deleteReview}= require('../controllers/productController')
const {isAuthenticatedUser,authorizesRoles }= require('../middleware/auth')
const router=express.Router()
router.route('/products').get(getAllProducts)
router.route('/products/new').post(isAuthenticatedUser,authorizesRoles("admin"),createProduct)
router.route('/product/:id').put(isAuthenticatedUser,authorizesRoles("admin"),updateProduct).delete(isAuthenticatedUser,authorizesRoles("admin"),deleteProduct).get(getProductDetail)
router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(getProductReview).delete(isAuthenticatedUser,deleteReview);
module.exports=router