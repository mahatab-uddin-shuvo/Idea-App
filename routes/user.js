const express =  require('express');
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

//get auth user information /users/:id
router.get('/me',isAuth,getUserController);

router.get('/me/edit',isAuth,editUserController);

router.put('/me',isAuth,updateUserValidators(),updateUserValidate,updateUserController);

router.delete('/me',isAuth,deleteUserController);

router.get('/me/ideas',isAuth,dashboardController)

//get idas by user
//   users/:id/ideas GET request
router.get('/:id/ideas',getUserIdeasController);


module.exports = router;