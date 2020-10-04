const { validationResult } = require('express-validator');


const addIdeaValidate = (req,res,next)=>{
    const allowComments = req.body.allowComments ? true : false
    req.allowComments = allowComments
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.render('ideas/new', {
            title: 'Add Idea',
            path:'/ideas/new',
            errMsg: errors.array()[0].msg,
            idea: {
                title: req.body.title,
                description: req.body.description,
                allowComments,
                status: req.body.status
            }
        })

    }else{
        next()
    }
}


module.exports = addIdeaValidate
    
