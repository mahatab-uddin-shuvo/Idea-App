const { validationResult } = require('express-validator');

const {generateIdeaDoc,generateCommentDoc} = require('../helpers/docGenate');
const Idea = require('../models/idea');
const {Comment} = require('../models/comment')

const updateCommentValidate = async(req,res,next)=>{
    const id = req.params.id;
    const comment_id = req.params.comment_id
    const idea = await Idea.findById(id);
    const comment = await Comment.findById(comment_id)
    if(comment){
        const ideaDocuments = generateIdeaDoc(idea);
        const contextComments = generateCommentDoc(comment)  
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('comments/edit',{
                title:'Edit a Comment',
                errMsg:errors.array()[0].msg,
                idea:ideaDocuments,
                comment:{
                    _id:req.params.comment_id,
                    title:req.body.title,
                    text:req.body.text
                }
            })
        }else{
            next();
        }
    }else{
        res.status(404).render('pages/NotFound',{
            title:'Not Found'
        });
    }
  
}

module.exports = updateCommentValidate