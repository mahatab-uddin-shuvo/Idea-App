const Idea = require('../models/idea')
const {generateIdeaDoc,generateCommentDoc} = require('../helpers/docGenate')
const addCommentController = async(req,res)=>{
    const id = req.params.id
    //get idea 
    const idea = await Idea.findById(id)
    if(idea){
        const ideaDocument  = generateIdeaDoc(idea._id,idea.title)
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
       //adding comment to idea
       idea.comments.push(req.body);
       //saving data
       await idea.save()
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
        const comments = idea.comments.filter(comment =>comment._id.toString()!==comment_id)
        idea.comments = comments
       //saving data
       await idea.save()
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
  
 
    if(idea.comments){
        contextComments = idea.comments.map(
           comment =>generateCommentDoc(
               comment._id,comment.title,comment.text))
    
        res.render('comments/edit',{
            title:'Edit Comment',
            idea:contextComments,
        })
    }else{
        res.status(404).render('pages/NotFound',{
            title:'Not Found'
        });
    }
    console.log(contextComments)
    console.log(comment_id)
}


const updateCommentController = (req,res)=>{
    const id = req.params.id;
    const comment_id = req.params.id;
    console.log(req.body)


}

module.exports ={
    addCommentController,
    postCommentController,
    deleteCommentController,
    editCommentController,
    updateCommentController
}