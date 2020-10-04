const  {validationResult} = require('express-validator')

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

module.exports = {
    registerValidate,
    loginValidate
}