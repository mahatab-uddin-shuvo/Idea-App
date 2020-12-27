const { validationResult } = require('express-validator');
const Category = require('../models/category')
const {generateCategoryDoc} = require('../helpers/docGenate')
const addIdeaValidate = async(req,res,next)=>{
    const allowComments = req.body.allowComments ? true : false
    req.allowComments = allowComments
    const errors = validationResult(req);
    const categories =await Category.find()
    const contextCategories = categories.map(category => 
        generateCategoryDoc(category))

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
            },
            categories:contextCategories
        })

    }else{
        next()
    }
}


module.exports = addIdeaValidate
    
