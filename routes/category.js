const express = require('express');
const { route } = require('express/lib/router');
const { get } = require('mongoose');
const router = express.Router();

//controllers
const {
    addCategoryController,
    postCategoryController,
    getCategoriesController,
    deleteCategoryController,
    getCatIdeasController
} = require('../controllers/categoryControllers')

//middleware
const{ isAuth, ensureAdmin} = require('../middleware/authMiddleware')

//validators 
const {addCategoryValidate} = require('../validators/categoryValidate');
const {addCategoryValidators} = require('../validators/categoryValidators');


//get /categories/new show for to add Category
router.get('/new',isAuth ,ensureAdmin, addCategoryController)

//POST /categories adding category in the database
router.post('/',addCategoryValidators(),addCategoryValidate,isAuth ,ensureAdmin, postCategoryController)

//get /categories finding all categories from the database
router.get('/',getCategoriesController)
//DELETE /categories/:cat_name
router.delete('/:cat_name',deleteCategoryController)
//get /categories/:cat_name/ideas get all ideas related to category
router.get('/:cat_name/ideas',getCatIdeasController)

module.exports = router