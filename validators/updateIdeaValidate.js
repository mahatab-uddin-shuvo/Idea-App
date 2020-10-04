const { validationResult } = require('express-validator');

const updateIdeaValidate = (req,res,next)=>{

    //1.  const allowComments = req.body.allowComments ? true : false      
    // console.log(allowComments)

    // req.body.allowComments=allowComments
    //2. 
    // if (req.body.allowComments === 'on') {
    //     req.body.allowComments = true
    // } else {
    //     req.body.allowComments = false
    // }
    const id = req.params.id;
    const errors = validationResult(req)
    const allowComments = req.body.allowComments ? true : false
    req.allowComments = allowComments

    if (!errors.isEmpty()) {
        return res.render('ideas/edit', {
            title: 'Edit Idea',
            path:'/ideas/edit',
            errMsg: errors.array()[0].msg,
            idea: {
                id,
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

module.exports = updateIdeaValidate