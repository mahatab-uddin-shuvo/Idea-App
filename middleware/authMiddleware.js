const { isDate } = require('lodash')
const Idea = require('../models/idea')
const {Comment} = require('../models/comment')


const isAuth = (req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('error_msg','Please Login to perform the action')
        res.redirect('/auth/login')
    }
}

const ensureAdmin = (req,res,next)=>{
    if(req.user.role === 1){
        next()
    }else{
        req.flash('error_msg','You are Not allowed perform the action')
        res.redirect('back')
    }
}

const ensureGuest = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.redirect('/users/me/ideas');
    }else{
        next();
    }
}

const checkIdeaOwnership= async (req,res,next)=>{
    const id = req.params.id;
    const idea = await Idea.findById(id);
    
    
    if(idea){
       if(idea.user.id.equals(req.user._id)){
           next()
       }else{
        req.flash('error_msg','You are not allowed to perform the action');
        res.redirect('back')
       }
    }else{
        req.flash('error_msg','Idea not Found');
        res.redirect('back')
    }
}

const checkCommentOwnership= async (req,res,next)=>{
    const id = req.params.comment_id;
    const comment = await Comment.findById(id);
    
    
    if(comment){
       if(comment.user.id.equals(req.user._id)){
           next()
       }else{
        req.flash('error_msg','You are not allowed to perform the action');
        res.redirect('back')
       }
    }else{
        req.flash('error_msg','Comment not Found');
        res.redirect('back')
    }
}

module.exports = {
    isAuth,
    ensureGuest,
    checkIdeaOwnership,
    checkCommentOwnership,
    ensureAdmin

}