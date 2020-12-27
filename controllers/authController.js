const _ = require('lodash')
const User = require('../models/user')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const {welcomeEmail,passwordResetEmail} = require('../email/account') 
const mailConfig = require ('../config/mailConfig')
const {accountActivationSecret,resetPasswordSecret} = require('../config/key')
//configuring transport
const transporter = nodemailer.createTransport(mailConfig);

const getRegisterController = (req,res) =>{
     res.render('auth/register',{
         title: 'register for sharing ideas',
         path: "/auth/register"
     })
}

const postRegisterController = async(req,res)=>{
    //const user = new User(req.body);
    const {firstName,lastName,email,password} =  req.body;
    const token = jwt.sign({firstName,lastName,email,password},
        accountActivationSecret,{expiresIn:5*60});
      
    //await user.save();
    //sending email
    transporter.sendMail(welcomeEmail(email,token));
    req.flash('success_msg','Email Sent, Please Activate Your Account')
    res.redirect('/auth/register')
}

const acountActivationController = async(req,res)=>{
    const token = req.params.token;
     jwt.verify(token,accountActivationSecret,async(err,decoded)=>{
       if(err){
           req.flash('error_msg','Account Activation Failed, try again')
           return res.redirect('/auth/register');
       }
       const {firstName,lastName,email,password} = decoded;
       const foundUser = await User.findOne({email})
   
       if(foundUser){
        req.flash('error_msg','Account Already Activated,You can log in');
        res.redirect('/auth/login')
       }else{
        const user = new User({
            firstName,
            lastName,
            email,
            password
        })
        await user.save();
        req.flash('success_msg','Account Activated , You can log in');
        res.redirect('/auth/login')
       }
    })
}

const getLoginController = async(req,res) =>{
    res.render('auth/login',{
        title:'Login Idea',
        path :'/auth/login'
    })
 }

const postLoginController = (req,res)=>{
    req.flash('success_msg','LogIn Successfully')
    console.log('Success login')
    res.redirect('/ideas')
}

const getLogOutController = async(req,res)=>{
  req.logout()
  console.log('Success logout')
  req.flash('success_msg','LogOut Successfully')
  res.redirect('/auth/login')
}
 
const getforgetPasswordController =(req,res)=>{
   res.render('auth/forget-password',{
    title:'Forget Password'
  })
}

const postforgetPasswordController = async(req,res)=>{
    const email = req.body.email;
    const user = await User.findOne({email})    

    //genarating token
    const token = jwt.sign({email},
        resetPasswordSecret,{expiresIn:10*60});

    //token store db    
    user.resetPasswordToken =token;

    await user.save({validateBeforeSave:false});

    transporter.sendMail(passwordResetEmail(email,token));

        
    req.flash('success_msg','Reset Password Link was sent to email , please follow instruction');
    res.redirect('/auth/forget-password')
}

const getResetPasswordController = (req,res)=>{
     const token = req.params.token;
     jwt.verify(token,resetPasswordSecret,async(err,decoded)=>{
         if(err){
             req.flash('error_msg','Password Reset failed , please try reset your password again');
             return res.redirect('/auth/forget-password');
         }
         const {email} = decoded;
         const user = await User.findOne({email,resetPasswordToken:token});
         if(user){
            res.render('auth/reset-password',{
                title:'Reset Password',
                token,
                email
            })
         }else{
            req.flash('error_msg','Password Reset failed,please try again');
            return res.redirect('/auth/forget-password'); 
         }
     })
}

const postResetPasswordController = async(req,res)=>{
    const {email,password,token} = req.body;
    jwt.verify(token,resetPasswordSecret,async(err,decoded)=>{
        if(err){
            req.flash('error_msg','Password Reset failed,please try reset your password again');
            return res.redirect('/auth/forget-password');
        }
        const user = await User.findOne({email,resetPasswordToken:token});
        if(user){
           user.password = password
           user.resetPasswordToken = undefined;
           await user.save();
           req.flash('success_msg','Password Resetter Successfully,please login with new Password');
           res.redirect('/auth/login');
        }else{
           req.flash('error_msg','Password Reset failed,please try again');
           return res.redirect('/auth/forget-password'); 
        }
    })

}

module.exports = {
    getRegisterController,
    postRegisterController,
    getLoginController,
    postLoginController,
    getLogOutController,
    acountActivationController,
    getforgetPasswordController,
    postforgetPasswordController,
    getResetPasswordController,
    postResetPasswordController
}