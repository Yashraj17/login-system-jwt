const userModel = require('../Model/userModel')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const  transporter  = require('../DataBase/emailConfig');

class userController{
    //signup view function
    static SignupPage = (req,res)=>{
    res.render('signup',{ csrfToken: req.csrfToken() })
    }
    static SignupUser = async (req,res)=>{
        const {username,email,password,confirm_password} = req.body
        const user = await userModel.findOne({email:email})
        if (user!=null) {
            res.send({'status':'faild','message':'Email already exits'})
        } else {
            if (username && email && password && confirm_password ) {
                if (password === confirm_password) {
                    try {
                        const hasspassword = await bcrypt.hash(password,10);
                        const data = new userModel({
                            username :username,
                            email:email,
                            password:hasspassword
                        })
                        await data.save();
                        const saved_user = await userModel.findOne({email:email});
                        //generate jwt token
                        const token = jwt.sign({userId:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'});
                        // console.log(token);
                        res.cookie('jwt',token)
                        res.redirect('/')
                    } catch (error) {
                        res.send(error.message)
                    }
                } else {
                    res.send({'status':'faild','message':'Password and Confirm Password is not same'})
                }
            } else {
                res.send({'status':'faild','message':'All field requird'})
            }
        }
    }
        //login view function
        static LoginPage = (req,res)=>{
                res.render('login',{ csrfToken: req.csrfToken() })
        }
        static LoginUser = async (req,res)=>{
            try {
                const {email,password} = req.body;
                if (email && password) {
                    const user = await userModel.findOne({email:email})
                    if (user!=null) {
                        const isMatch = await bcrypt.compare(password,user.password);
                        if ((user.email == email ) && isMatch) {
                            //generate jwt token
                            const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'});
                            // res.render('home',{'status':'success','message':'You are logged in','token':token})
                            console.log(token);
                            res.cookie('jwt',token)
                            req.flash("success",'You are Logged in')
                            res.redirect('/home')
                           
                        } else {
                            req.flash("danger",'Email or Password does not match')
                            res.redirect('/')
                        }
                    } else {
                        req.flash("danger",'You are not Registered User')
                        res.redirect('/')
                    }
                } else {
                    req.flash("danger",'All field required')
                    res.redirect('/')
                    // res.send({'status':'faild','message':'All field requird'})
                }
            } catch (error) {
                
            }
        }
        static Logout = (req,res)=>{
            res.clearCookie('jwt')
            req.flash("danger",'You are logged out')
            console.log('you are logged out');
            res.redirect('/')
        }

        ///////////change password////////////
        static changePassWord = async (req,res)=>{
            try {
                const {password,confirm_password} = req.body;
                if (password && confirm_password) {
                    if (password !== confirm_password) {
                        res.send({'status':'faild','message':'New password and confirm passsword does not match'})
                    } else {
                        const hasspassword = await bcrypt.hash(password,10);
                        await userModel.findByIdAndUpdate(req.user._id,{$set:{password:hasspassword}})
                        res.redirect('/home')
                    }
                } else {
                    res.send({'status':'faild','message':'All field requird'})
                }
            } catch (error) {
                
            }
        }
        //view change password page
        static changePassWordPage = (req,res) =>{
            res.render('changePassword')
        }


        static homePage = (req,res) =>{
            res.render('home',{name:req.user})
        }
     
        //view verify email page
        static verifyEmailPage = (req,res) =>{
            res.render('verifyEmail')
        }
        //reset verify email
        static verifyEmail = async (req,res)=>{
            const {email}= req.body;
            if (email) {
                const user = await userModel.findOne({email:email})
                if (user) {
                    const secret = user._id + process.env.JWT_SECRET_KEY
                    const token = jwt.sign({userId:user._id},secret,{expiresIn:'5d'});
                    const link = `https://login-system-jwt.herokuapp.com/user/reset/${user._id}/${token}`

                    var mailOptions = {
                        from:process.env.EMAIL_FROM,
                        to:user.email,
                        subject:"JWT AUTHENTICATION PASSWORD RESET",
                        html:`<a href=${link}>Click Here</a> to Reset Password`
                    };
                    ///SEND EMAIL
                    // let info = await transporter.sendMail({
                    //     from:process.env.EMAIL_FROM,
                    //     to:user.email,
                    //     subject:"JWT AUTHENTICATION PASSWORD RESET",
                    //     html:`<a href=${link}>Click Here</a> to Reset Password`
                    // })
                    await transporter.sendMail(mailOptions,function (error,response) {
                        if (error) {
                            console.log(error);
                        } else {
                            req.flash("danger",'Please Check Your Gmail to Recover Your Password')
                            res.redirect('/');
                        }
                    })

                } else {
                    res.send({'status':'faild','message':'Email does exits Please signup'})
                }
            } else {
                res.send({'status':'faild','message':'field requird'})
            }
        }



        static forgetPassWordPage = (req,res) =>{
            res.render('forgetPassword')
        }



        static resetPassword = async (req,res)=>{
            const {password,confirm_password} = req.body;
            const {id,token} = req.params
            const user = await userModel.findById(id)
            const new_secret = user._id + process.env.JWT_SECRET_KEY
            try {
                 jwt.verify(token,new_secret)
                if (password && confirm_password) {
                    if (password !== confirm_password) {
                        res.send({'status':'faild','message':'New password and confirm passsword does not match'})
                    } else {
                        const hasspassword = await bcrypt.hash(password,10);
                         await userModel.findByIdAndUpdate(id,{$set:{password:hasspassword}})
                        console.log('password updated successfully');
                        res.redirect('/')
                    }
                } else {
                    res.send({'status':'faild','message':'All field requird'})
                }
            } catch (error){
            }
        }

}
module.exports = userController
