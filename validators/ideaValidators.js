const { check } = require('express-validator');
const { isLength, values } = require('lodash');


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
             .trim()
             .isLength({min:1}),
        check('ideaImage').custom((value,{req})=>{
            const {file} = req
            if(file){
                if(
                    file.mimetype === 'image/jpeg' || 
                    file.mimetype === 'image/jpg' ||
                    file.mimetype === 'image/png'
                  ){
                        return true;    
                    }else{
                        throw new Error('only image file with jpg.jpeg.png is allowed')  
                    }
            }else{
                return true;
            }
            
        }),
        check('ideaImage').custom((value,{req})=>{
            const{file} = req
            if(file){
                if(file.size > 5245880)//5mb -bytes
                {
                    throw new Error('file size less then 5mb')  
                }else{
                    return true;
                }
            }else{
                return true;
            }
        })     
    ]
}
module.exports = ideaValidators
