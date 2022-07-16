const express=require('express')
const { registerUser, loginUser, logoutUser, forgetPassword,resetPassword,getUserDetail,updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser} = require('../controllers/userController')
const { isAuthenticatedUser, authorizesRoles } = require('../middleware/auth')
const router=express.Router()
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forget').post(forgetPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').get(logoutUser)
// get User Detail
router.route('/me').get(isAuthenticatedUser,getUserDetail);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateProfile)
router.route('/admin/users').get(isAuthenticatedUser,authorizesRoles('admin'),getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizesRoles('admin'),getSingleUser).put(isAuthenticatedUser,authorizesRoles('admin'),updateUserRole).delete(isAuthenticatedUser,
authorizesRoles('admin'),deleteUser)
module.exports=router