const {check, checkSchema} = require('express-validator')
const User = require('../models/user')
const { values } = require('lodash')
const { Error } = require('mongoose')
const registerValidators = ()=>{
    return[
      check('firstName')
      .notEmpty()
      .withMessage('FirstName is Must Be Required')
      .isLength({max:20})
      .withMessage('FirstName must be less then 20 Characters')
      .trim(),

      check('lastName')
      .notEmpty()
      .withMessage('lastName is Must Be Required')
      .isLength({max:20})
      .withMessage('lastName must be less then 20 Characters')
      .trim(),

      check('email')
      .notEmpty()
      .withMessage('Email Must be Required')
      .isEmail()
      .withMessage('Email Must be Valid')
      .trim(),
    //   .normalizeEmail(),
      check('email')
      .custom(async email=>{
        const user = await User.findOne({email})
        if(user){
            throw new Error('Email is Already Registerd')
        }else{
            return true;
        }
      }),

      check('password')
      .notEmpty()
      .withMessage('Password is Must be required')
      .isLength({min:6,max:50})
      .withMessage('Password is Must be in between 6 to 50 character')
      .not()
      .isIn(['password','123456','god123'])
      .withMessage('Password must not contain common password'),

      check('confirmPassword')
      .notEmpty()
      .withMessage('Confirm Password is Must be required')
      .custom((confirmPassword,{req})=>{
          if(confirmPassword == req.body.password){
              return true
          }else{
              throw new Error("Confirm password don't match")
          }
      })

    ]
}

const loginValidators = () =>{
    return[
        check('email')
        .notEmpty()
        .withMessage('Email Must be Required')
        .isEmail()
        .withMessage('Email Must be Valid'),
    
        check('password')
        .notEmpty()
        .withMessage('Password is Must be required')

    ]
}


const updateUserValidators = () =>{
    return[
        check('firstName')
        .trim()
        .notEmpty()
        .withMessage('FirstName Must be required')
        .isLength({max:100})
        .withMessage('FirstName must be less then 100 character'),

        check('lastName')
        .trim()
        .notEmpty()
        .withMessage('LastName Must be required')
        .isLength({max:100})
        .withMessage('lastName must be less then 100 character')
        .trim(),

        check('profilePic')
        .custom((value,{req})=>{
           const {file} = req;
           if(file){
            if(
                file.mimetype === 'image/jpeg' || 
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/png'
                ){
                   return true;   
                }else{
                   throw new Error('Only image file with jpeg,jpg,png is allowed')  
                }
           }else{
               return true;
           }
        }),

        check('profilePic')
        .custom((value,{req})=>{
           const {file} = req;
           if(file){
              if(file.size < 1000000){
                   return true;   
              }else{
                   throw new Error('Image file less then 1 Mb is allowed')  
                }
           }else{
               return true;
           }
        })
    ]
}

const forgetPasswordValidators = ()=>{
    return[
        check('email')
        .notEmpty()
        .withMessage('Email Must be Required')
        .isEmail()
        .withMessage('Email Must be Valid'),
       check('email').custom(async(email) =>{
          const user = await User.findOne({email});
          if(!user){
              throw new Error('User not Exist')
          } else{
              return true;
          }
       }) 
    ]
}

const resetPasswordValidators = ()=>{
    return[
      check('password')
      .notEmpty()
      .withMessage('Password is Must be required')
      .isLength({min:6,max:50})
      .withMessage('Password is Must be in between 6 to 50 character')
      .not()
      .isIn(['password','123456','god123'])
      .withMessage('Password must not contain common password'),

      check('confirmPassword')
      .notEmpty()
      .withMessage('Confirm Password is Must be required')
      .custom((confirmPassword,{req})=>{
          if(confirmPassword == req.body.password){
              return true
          }else{
              throw new Error("Confirm password don't match")
          }
      })

    ]
}

module.exports = {
    registerValidators,
    loginValidators,
    updateUserValidators,
    forgetPasswordValidators,
    resetPasswordValidators
}