const  {validationResult} = require('express-validator')
const {generateUserDoc} = require('../helpers/docGenate');
const User = require('../models/user')

const registerValidate = (req,res,next) =>{
   const errors = validationResult(req)
   if(!errors.isEmpty()){
        res.render('auth/register',{
           title:'Register for sharing Ideas',
           path:'/auth/register',
           errMsg: errors.array()[0].msg,
           userInput:{
               firstName: req.body.firstName,
               lastName:  req.body.lastName,
               email:     req.body.email,
               password:  req.body.password,
               confirmPassword:  req.body.confirmPassword
           }
       })
   }
   else{
       next()
   }
}

const loginValidate = (req,res,next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
         res.render('auth/login',{
            title:'Login',
            errMsg: errors.array()[0].msg,
            path: '/auth/login',
            userInput:{
                email: req.body.email
            }
        })
    }
    else{
        next()
    }
 }


 
 const updateUserValidate = async(req,res,next)=>{
     const user = await User.findById(req.user._id)
         const userDoc = generateUserDoc(user);
         const errors = validationResult(req);
         if(!errors.isEmpty()){
             res.render('users/edit-profile',{
                 title:`Edit Profile of ${user.firstName}`,
                 errMsg:errors.array()[0].msg,
                 path:'/users/me',
                 userInput:{
                     firstName:req.body.firstName,
                     lastName:req.body.lastName
                 }
             })
         }else{
             next();
         }
   
 }

 
module.exports = {
    registerValidate,
    loginValidate,
    updateUserValidate
}