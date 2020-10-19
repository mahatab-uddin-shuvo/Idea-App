//model
const Idea = require('../models/idea')
const {Comment} = require('../models/comment')
//helper
const {generateIdeaDoc,generateCommentDoc} = require('../helpers/docGenate')
const _ = require('lodash');

const addCommentController = async(req,res)=>{
    console.log(req.user)
    const id = req.params.id
    //get idea 
    const idea = await Idea.findById(id)
    if(idea){
        const ideaDocument  = generateIdeaDoc(idea)
        res.render('comments/new',{
            title:'Add a Comment',
            idea:ideaDocument
        })
    }else{
        res.status(404).render('pages/NotFound',{
            title:'Not Found'
        });
    }
    
}

const postCommentController =async(req,res)=>{
    const id = req.params.id
    ///get idea
    const idea = await Idea.findById(id);
    if(idea){  
       const comment = new Comment({
           ...req.body,
           idea: idea.id,
           user:{
               id:req.user._id,
               firstName:req.user.firstName
           }
       });
       await comment.save()
       req.flash('success_msg','Comment Added Successfully')
       res.redirect(`/ideas/${id}`)

    }else{
        res.status(404).render('pages/NotFound',{
            title:'Not Found'
        });
    }
}


const deleteCommentController = async(req,res)=>{
    const id = req.params.id
    const comment_id = req.params.comment_id
    ///get idea
    const idea = await Idea.findById(id);
    if(idea){  
        await Comment.findByIdAndDelete(comment_id)
        req.flash('success_msg','Comment Delete Successfully')
       res.redirect(`/ideas/${id}`)

    }else{
        res.status(404).render('pages/NotFound',{
            title:'Not Found'
        });
    }
}

const editCommentController = async(req,res)=>{
    const id = req.params.id;
    const comment_id = req.params.comment_id
    const idea = await Idea.findById(id);
    const comment = await Comment.findById(comment_id)

    let contextComments;
    if(comment){
        const ideaDocument  = generateIdeaDoc(idea)
         contextComments = generateCommentDoc(comment)   
         console.log(contextComments)    
        res.render('comments/edit',{
            title:'Edit Comment',
            idea:ideaDocument,
            comment: contextComments
        })
      
    }else{
        res.status(404).render('pages/NotFound',{
            title:'Not Found'
        });
    }
    

}


const updateCommentController = async(req,res)=>{
    const id = req.params.id;
    const comment_id = req.params.comment_id;
    const pickedValue = _.pick(req.body, [
        'title',
        'text'
    ]);

  console.log(pickedValue)
  const comment = await Comment.findByIdAndUpdate(comment_id, pickedValue);
  if (comment) {
      req.flash('success_msg','Comment Updated Successfully')
      res.redirect(`/ideas/${id}`); 
  } else {
      res.status(404).render('pages/NotFound')

  }
}

module.exports ={
    addCommentController,
    postCommentController,
    deleteCommentController,
    editCommentController,
    updateCommentController
}