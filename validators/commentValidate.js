const { validationResult } = require('express-validator');

const {generateIdeaDoc} = require('../helpers/docGenate');
const Idea = require('../models/idea');

const addCommentValidate = async(req,res,next)=>{
    const id = req.params.id
    const idea = await Idea.findById(id);
    if(idea){
        const ideaDocuments = generateIdeaDoc(idea._id,idea.title);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('comments/new',{
                title:'Add a Comment',
                errMsg:errors.array()[0].msg,
                idea:ideaDocuments
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

module.exports = addCommentValidate