const express = require('express');

const router = express.Router({mergeParams:true});

const {addCommentController,
    postCommentController,
    deleteCommentController,
    editCommentController,
    updateCommentController} = require('../controllers/commentController');

//validate
const addCommentValidators=  require('../validators/commentValidators');
const addCommentValidate=  require('../validators/commentValidate');
const updateCommentValidate =require('../validators/updateCommentValidate');

//middleware
const {isAuth,checkCommentOwnership}= require('../middleware/authMiddleware')

//get comment form to add comment
router.get('/new',isAuth,addCommentController)

//POST - comment/ideas/:id/comments
router.post('/',isAuth,addCommentValidators(),addCommentValidate,postCommentController)

//Delete - comment/ideas/:id/comments/:comment_id

router.delete('/:comment_id',isAuth,checkCommentOwnership,deleteCommentController)

//edit  -comment/ideas/:id/comments/:comment_id/edit
router.get('/:comment_id/edit',isAuth,checkCommentOwnership,editCommentController)

//update
router.put('/:comment_id',isAuth,checkCommentOwnership,addCommentValidators(),updateCommentValidate,updateCommentController)

module.exports = router