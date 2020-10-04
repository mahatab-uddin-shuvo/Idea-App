const {check} = require('express-validator')

const addCommentValidators = () =>{
    return[
        check('title')
        .trim()
        .notEmpty()
        .withMessage('Titte Must be required')
        .isLength({max:100})
        .withMessage('Title must be less then 100 character'),

        check('text')
        .isLength({max:100})
        .withMessage('comment info must be less then 1000 character')
    ]
}

module.exports = addCommentValidators;