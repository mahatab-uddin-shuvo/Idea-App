const _ = require('lodash')
const User = require('../models/user')


const getRegisterController = (req,res) =>{
     res.render('auth/register',{
         title: 'register for sharing ideas',
         path: "/auth/register"
     })
}

const postRegisterController = async(req,res)=>{
 
    const pickValue =_.pick(req.body,[
        'firstName',
        'lastName',
        'email',
        'password'
    ]);  
    const user = new User(pickValue)
    await user.save()
    req.flash('success_msg','Registration Successfully')
    res.redirect('/auth/login')
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
 
module.exports = {
    getRegisterController,
    postRegisterController,
    getLoginController,
    postLoginController,
    getLogOutController
}