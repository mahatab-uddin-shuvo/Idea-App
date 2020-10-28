const express =  require('express');
const multer = require('multer');
const router = express.Router();

//controller
const {getUserController,
      editUserController,
      updateUserController,
      deleteUserController,
      getUserIdeasController,
      dashboardController
        } = require('../controllers/userController')

//validators 
const {updateUserValidators} = require('../validators/userValidators')    
//validate 
const {updateUserValidate} = require('../validators/userValidate')  
//middleware
const {isAuth} = require('../middleware/authMiddleware')

// const storage = multer.diskStorage({
//      destination(req,file,cb){
//         cb(null,'./uploads')
//      },
//      filename(req,file,cb){
//         cb(null,Date.now() + file.originalname)    
//      }
// })

// const fileFilter = (req,file,cb)=>{
//     if(
//     file.mimetype === 'image/jpeg' || 
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/png'
//     ){
//        // allowing image upload     
//        cb(null,true)     
//     }else{
//         //rejecting image upload    
//         cb(null,false)  
//         // passing error
//         //cb(new Error('Only Image is Allowed'))  
//     }
// }

const profileImageUpload = multer({
     //storage,
     //fileFilter,
    // limits:{
    //   fileSize:1000000 //1mb     
    // }   
}).single('profilePic');

//get auth user information /users/:id
router.get('/me',isAuth,getUserController);

router.get('/me/edit',isAuth,editUserController);

router.put('/me',isAuth,profileImageUpload,updateUserValidators(),updateUserValidate,updateUserController);

router.delete('/me',isAuth,deleteUserController);

router.get('/me/ideas',isAuth,dashboardController)

//get idas by user
//   users/:id/ideas GET request
router.get('/:id/ideas',getUserIdeasController);


module.exports = router;