const express = require('express')
const router = express.Router();
const csrf = require('csurf')
const cookieParser = require('cookie-parser');
const userController = require('../Controller/userController');
const checkUserAuth = require('../Middleware/auth');

const { check, validationResult } = require('express-validator');


var csrfProtection = csrf({ cookie: true });
 
router.use(cookieParser());

//signup route
router.get('/signup',csrfProtection,userController.SignupPage)
router.post('/signup',[
    check("username").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({min:3}),
    check("confirm_password").isLength({min:3}),
],csrfProtection,userController.SignupUser)
//login route
router.get('/',csrfProtection,userController.LoginPage)

//login use post route
router.post('/',
[
    check("email").isEmail(),
    check("password").isLength({min:3}),
],userController.LoginUser)


//logout route
router.get('/logout',checkUserAuth,userController.Logout)
//home route
router.get('/home',checkUserAuth,userController.homePage)


//change password page
router.get('/changePassword',checkUserAuth,userController.changePassWordPage)
//change password
router.post('/changePassword',checkUserAuth,userController.changePassWord)


//verify email for password reset
router.get('/forgetpassword',userController.verifyEmailPage)
//change password
router.post('/forgetpassword',[
    check("email").isEmail(),
],userController.verifyEmail)
//forgetpassword page
router.get('/user/reset/:id/:token',userController.forgetPassWordPage)

//reset password
router.post('/user/reset/:id/:token',userController.resetPassword)

module.exports = router