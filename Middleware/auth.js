const jwt = require('jsonwebtoken');
const userModel = require('../Model/userModel')

var checkUserAuth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt
        if (token !=null) {
            const verifyUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
            const data = await userModel.findById(verifyUser.userId).select('-password')
            if (data!=null) {
                console.log(data);
                req.user = data
            next()
            } else {
                res.send('You are Unauthorized')
            }
            
        } else {
            res.redirect('/')
        }
     
    } catch (error) {
        console.log(error.message);
        
    }
    
}
module.exports =checkUserAuth;