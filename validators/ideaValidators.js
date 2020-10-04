const { check } = require('express-validator');
const { isLength } = require('lodash');


const ideaValidators = () =>{
    return [
        check('title')
            .notEmpty()
            .withMessage('title must be required')
            .isLength({ min: 2, max: 50 })
            .withMessage('title must be 2 to 50 character long')
            .trim(),
    
        check('description', 'Description must be less then 10000 character')
            .isLength({ max: 1000 }),
    
        check('status')
            .notEmpty()
            .withMessage('status is required')
            .isIn(['public', 'private'])
            .withMessage('Status must be public or private'),
        check('tags')
             .trim()
             .isLength({min:1})
             .withMessage('Idea Must have One Tag')    
    ]
}
module.exports = ideaValidators
