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


//get comment form to add comment
router.get('/new',addCommentController)

//POST - comment/ideas/:id/comments
router.post('/',addCommentValidators(),addCommentValidate,postCommentController)

//Delete - comment/ideas/:id/comments/:comment_id
router.delete('/:comment_id',deleteCommentController)

//edit  -comment/ideas/:id/comments/:comment_id/edit
router.get('/:comment_id/edit',editCommentController)

//update
router.put('/:comment_id',updateCommentController)

module.exports = router