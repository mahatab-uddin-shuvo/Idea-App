 const {validationResult} = require('express-validator');

 const addCategoryValidate = (req,res,next)=>{
     const errors = validationResult(req);

     if(!errors.isEmpty()){
         res.status(400).send({success:false,message:errors.array()[0].msg});
     }else{
         next();
     }
 }

 module.exports = {addCategoryValidate}