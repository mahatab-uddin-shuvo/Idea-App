const {check} = require('express-validator')

const Category =  require('../models/category')

const addCategoryValidators = () =>{
    return[
        check('category')
        .trim()
        .notEmpty()
        .withMessage('category Must be required')
        .isLength({max:15})
        .withMessage('category must be less then 15 character'),
      check('category')
      .custom(async category=>{
          const foundCategory = await Category.findOne({category})
          if(foundCategory){
              throw new Error('Category already Exist');
          }else{
              return true;
          }
      })
        
    ]
}

module.exports = {addCategoryValidators};