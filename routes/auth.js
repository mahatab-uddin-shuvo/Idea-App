const express = require('express');
const passport = require('passport')
const router = express.Router();


//import Controller
const {getRegisterController,
      postRegisterController,
      getLoginController,
      postLoginController ,
      getLogOutController
    } = require('../controllers/authController')

//validators
const {registerValidate,loginValidate} = require('../validators/userValidate')

const {registerValidators,loginValidators} = require('../validators/userValidators')




router.get('/register',getRegisterController)

//register user
router.post('/register',registerValidators(),registerValidate,postRegisterController)

router.get('/login',getLoginController)


router.post('/login',loginValidators(),loginValidate,
passport.authenticate('local',{
    failureRedirect:'/auth/login',
    failureFlash:true
}),postLoginController)

//logout user
router.get('/logout',getLogOutController)

router.get('/google',
passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback',
passport.authenticate('google',{failureRedirect:'/auth/login'}),
(req,res,next)=>{
   console.log(req.user);
   res.redirect('/ideas');

})

module.exports = router 