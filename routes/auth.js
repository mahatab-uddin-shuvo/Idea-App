const express = require('express');
const passport = require('passport')
const router = express.Router();

//import limiter 
const 
{registerLimiter,
    loginLimiter,
    forgetPasswordLimiter
    } = require('../middleware/limiter')

//import Controller
const {getRegisterController,
      postRegisterController,
      getLoginController,
      postLoginController ,
      getLogOutController,
      acountActivationController,
      getforgetPasswordController,
      postforgetPasswordController,
      getResetPasswordController,
      postResetPasswordController
    } = require('../controllers/authController')

//validators
const {registerValidate,loginValidate,forgetPasswordValidate,resetPasswordValidate} = require('../validators/userValidate')

const {registerValidators,loginValidators,forgetPasswordValidators,resetPasswordValidators} = require('../validators/userValidators')

//middleware
const {ensureGuest} = require('../middleware/authMiddleware')


router.get('/register',ensureGuest,getRegisterController)

//register user
router.post('/register',registerValidators(),registerValidate,registerLimiter,postRegisterController)
//activate account /auth/activate/:token
router.get('/activate/:token',acountActivationController)

router.get('/login',ensureGuest,getLoginController)


router.post('/login',ensureGuest,loginValidators(),loginValidate,loginLimiter,
passport.authenticate('local',{
    failureRedirect:'/auth/login',
    failureFlash:true
}),postLoginController)

//logout user
router.get('/logout',getLogOutController)

router.get('/google',ensureGuest,
passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback',ensureGuest,
passport.authenticate('google',{failureRedirect:'/auth/login'}),
(req,res,next)=>{
   console.log(req.user);
   res.redirect('/ideas');

})
//get forget password form /auth/forget-password GET
router.get('/forget-password',getforgetPasswordController);

//forget password form /auth/forget-password POST
router.post('/forget-password',forgetPasswordValidators(),forgetPasswordValidate,forgetPasswordLimiter,postforgetPasswordController)

//get reset password field form /auth/reset-password/:token GET
router.get('/reset-password/:token',getResetPasswordController)

//pos reset password /auth/reset-password/:token POST
router.post('/reset-password',resetPasswordValidators(),resetPasswordValidate,postResetPasswordController)

module.exports = router 