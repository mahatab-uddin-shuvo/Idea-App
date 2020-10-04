const express = require('express')
require('express-async-errors')
const router = express.Router();
//validators
const addIdeaValidate = require('../validators/addIdeaValidate')
const ideaValidators = require('../validators/ideaValidators')
const updateIdeaValidate = require('../validators/updateIdeaValidate') 
//middleware
const isAuth= require('../middleware/authMiddleware')
//const asyncMiddleware = require('../middleware/asyncMiddleware')
//controllers
const {
    getIdeasController,
    addIdeaController,
    editIdeaController,
    postIdeaController,
    getIdeaController,
    updateIdeaController,
    deleteIdeaController
    } = require('../controllers/ideaControllers')

//get all ideas
router.get('/',getIdeasController);

//show form to add idea
router.get('/new',isAuth,addIdeaController);

//show edit idea form
router.get('/:id/edit',isAuth,editIdeaController);

//add idea
router.post('/',isAuth, ideaValidators(), addIdeaValidate,postIdeaController);

//show single route
router.get('/:id', getIdeaController);

//update idea
router.put('/:id',isAuth, ideaValidators(),updateIdeaValidate,updateIdeaController);

//delete idea
router.delete('/:id',isAuth,deleteIdeaController);

module.exports = router;