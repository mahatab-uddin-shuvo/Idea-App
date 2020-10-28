const express = require('express')
require('express-async-errors')
const router = express.Router();
const multer = require('multer')
//configure multer
const uploadIdeaImage = multer().single('ideaImage')
//validators
const addIdeaValidate = require('../validators/addIdeaValidate')
const ideaValidators = require('../validators/ideaValidators')
const updateIdeaValidate = require('../validators/updateIdeaValidate') 
//middleware
const {isAuth,checkIdeaOwnership}= require('../middleware/authMiddleware')
//const asyncMiddleware = require('../middleware/asyncMiddleware')
//controllers
const {
    getIdeasController,
    addIdeaController,
    editIdeaController,
    postIdeaController,
    getIdeaController,
    updateIdeaController,
    deleteIdeaController,
    postLikeController,
    getLikeCountController,
    getCommentCountController
    } = require('../controllers/ideaControllers');
const { route } = require('express/lib/router');

//get all ideas
router.get('/',getIdeasController);

//show form to add idea
router.get('/new',isAuth,addIdeaController);

//show edit idea form
router.get('/:id/edit',isAuth,checkIdeaOwnership,editIdeaController);

//add idea
router.post('/',isAuth,uploadIdeaImage,ideaValidators(), addIdeaValidate,postIdeaController);

//show single route
router.get('/:id', getIdeaController);

//update idea
router.put('/:id',isAuth,checkIdeaOwnership,uploadIdeaImage,ideaValidators(),updateIdeaValidate,updateIdeaController);

//delete idea
router.delete('/:id',isAuth,checkIdeaOwnership,deleteIdeaController);
 
//add or remove likes /ideas/:id/likes - POST
router.post('/:id/likes',isAuth,postLikeController)

//get likes count
router.get('/:id/likes',getLikeCountController)

//get comment Count
router.get('/:id/comments',getCommentCountController)


module.exports = router;