const express = require('express')
require('express-async-errors')
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const _ = require('lodash');
const sharp = require('sharp');

const fs= require('fs')
const util = require('util')
const deleteFilePromise  = util.promisify(fs.unlink)

//doc helper
const { generateIdeaDoc, generateCommentDoc, generateCategoryDoc } = require('../helpers/docGenate')

//import Idea database
const Idea = require('../models/idea')
const { Comment } = require('../models/comment');
const Category = require('../models/category');
const { updateUserValidate } = require('../validators/userValidate');

//get all ideas
const getIdeasController = async (req, res, next) => {

    console.log(req.user)

    const page = +req.query.page || 1;
    const item_per_page = 1;

    const totalPublicIdeaCount = await Idea.find({
        status: 'public'
    }).countDocuments();

    //build the query
    const publicIdeas = await Idea
    .find({status:'public'})
    .skip((page-1)*item_per_page)
    .sort({updatedAt:-1}) //-1 => descending, 1 => accending
    .limit(item_per_page)

    //getting all idea
    const ideas = await Idea.find();

    //get all filtering  public ideas
    // const publicIdeas = ideas.filter(idea => idea.status === 'public')
    
    //creating public ideas context to avoid error
    const ideasPublicContext = publicIdeas.map(publicIdea=>generateIdeaDoc(publicIdea))

    //creating all ideas context to avoid error
    const ideasContext = ideas.map(idea=>generateIdeaDoc(idea))

    // get all categories 
    const categories = await Category.find()
      
    //creating context to avoid hbs errors
    const categoryContext = categories.map(category=>generateCategoryDoc(category))
    

    res.render('ideas/index', {
        ideas: ideasPublicContext,
        title: 'All Ideas',
        categories:categoryContext,
        ideasTags:ideasContext,
        currentPage:page,
        previousPage:page-1,
        nextPage:page+1,
        hasPreviousPage:page > 1,
        hasNextPage:page * item_per_page < totalPublicIdeaCount,
        lastPage: Math.ceil(totalPublicIdeaCount/item_per_page),
        path:'/ideas'

    });
};

//show form to add idea
const addIdeaController = async (req, res, next) => {
    const categories = await Category.find()
    const contextCategory = categories.map
        (category => generateCategoryDoc(category))
    //console.log(contextCategory)
    res.render('ideas/new', {
        title: 'Add Idea',
        path: '/ideas/new',
        categories: contextCategory
    })
}

//show edit idea form
const editIdeaController = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.render('pages/NotFound')
    }
    //get all categories
    const categories = await Category.find()

    const idea = await Idea.findById(id)
    
    if (idea) {
        const ideasDocument = generateIdeaDoc(idea)

        const ideaCategories =[];
        ideasDocument.categories.filter(({categoryName})=>{
            categories.map(({category})=>{
                if(category === categoryName){
                    ideaCategories.push({
                        category,
                        categoryName
                    })
                }
            })
        })
       
        //modifying existing array of object()
        categories.map((e,i)=>{
            if(e.category !==(ideaCategories[i] ? ideaCategories[i].category : '')){
                ideaCategories.push({
                    category:e.category,
                    categoryName:null
                })
            }
        })
     
        const uniqArr = _.uniqBy(ideaCategories,'category')

        res.render('ideas/edit', {
            title: 'Edit title',
            idea: ideasDocument,
            ideaCategories:uniqArr
        })
    } else {
        res.status(404).render('pages/NotFound')
    }

}

//add idea
const postIdeaController = async (req, res, next) => {
    
    req.body.tags = req.body.tags.split(',')
    
    const idea = new Idea({
        ...req.body,
        allowComments: req.allowComments,
        user: {
            id: req.user._id,
            firstName: req.user.firstName
        },
        categories: []
    });


    if (Array.isArray(req.body.categories)) {
        //looping all categories and save each category in each idea
        for (let index = 0; index < req.body.categories.length; index++) {
            const categoryName = req.body.categories[index];
            idea.categories.push({ categoryName });
        }
    }else{
        const categoryName = req.body.categories;
        idea.categories.push({ categoryName });
    }

    if(req.file){
        const filename = Date.now() + req.file.originalname

        //resize image 
     await sharp(req.file.buffer)
        .resize({
            width:1200,
            height:300
        })
        //.png()
        .toFile(`./uploads/ideas/${filename}`)

        //modified picked value obj and add image field value
        idea.image = filename;

    }
    await idea.save()

    req.flash('success_msg', 'Idea Added Successfully')
    console.log('Saved')

    res.redirect('/ideas');
}

//show single route 
const getIdeaController = async (req, res, next) => {
    const id = req.params.id;
    let contextComments;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.render('pages/NotFound')
    }
    //get the idea
    const idea = await Idea.findById(id).populate('comments');

    //Generating Comment Contexts to hbs error
    if (idea.comments) {
        contextComments = idea.comments.map(
            comment => generateCommentDoc(comment)
        )
    }

    if (idea) {
        const ideasDocument = generateIdeaDoc(idea);

        ideasDocument.categories = ideasDocument.categories.map
            (category => generateCategoryDoc(category)
            )
        ideasDocument.comments = contextComments


        res.render('ideas/show', {
            title: ideasDocument.title,
            idea: ideasDocument
        });
    } else {
        res.status(404).render('pages/NotFound')
    }
}

//update idea 
const updateIdeaController = async (req, res, next) => {
    const id = req.params.id
    console.log(req.body)
    req.body.allowComments = req.allowComments;
    req.body.tags = req.body.tags.split(',');

    const categories =[];

    //getting idea 
    const idea = await Idea.findById(id)

    if (Array.isArray(req.body.categories)) {
        //looping all categories and save each category in each idea
        for (let index = 0; index < req.body.categories.length; index++) {
            const categoryName = req.body.categories[index];
            categories.push({ categoryName });
        }
    }else{
        const categoryName = req.body.categories;
        categories.push({ categoryName });
    }

    req.body.categories = categories;

    const pickedValue = _.pick(req.body, [
        'title',
        'description',
        'allowComments',
        'status',
        'tags',
        'categories'
    ]);

    //upload update image
    if(req.file){
        const filename = Date.now() + req.file.originalname;

        //resize image 
      await sharp(req.file.buffer)
        .resize({
            width:1200,
            height:300
        })
        //.png()
        .toFile(`./uploads/ideas/${filename}`)

        //modified picked value obj and add image field value
        pickedValue.image = filename;
        //deleting existing image
        if(idea.image){
            deleteFilePromise(`./uploads/ideas/${idea.image}`)
        }
    }

    console.log("Updated data")
    console.log(pickedValue)

    const updatedIdea = await Idea.findByIdAndUpdate(id, pickedValue);

    if (updatedIdea) {
        req.flash('success_msg', 'Idea Updated Successfully')
        res.redirect(`/ideas/${id}`);
    } else {
        res.status(404).render('pages/NotFound')

    }
}

//delete idea
const deleteIdeaController = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.render('pages/NotFound')
    }
    const idea = await Idea.findByIdAndDelete(id)
    // remove idea image deleting after idea
    if(idea.image){
        deleteFilePromise(`./uploads/ideas/${idea.image}`)
    }

    console.log('Deleted Data')
    if (idea) {
        req.flash('success_msg', 'Idea Deleted Successfully')
        res.redirect('/ideas');

    } else {
        res.status(404).render('pages/NotFound')
    }
}

const postLikeController =async (req,res)=>{
    const id = req.params.id
    const userId = req.body.userId
    
    //get idea
    const idea = await Idea.findById(id);
    if(idea){
        if(!idea.likes.includes(userId)){
            idea.likes.push(userId);
            await idea.save();
            res.send({
                success: true,
                message: 'You liked the Idea'
            })
        }else{
            //remove the likes from ideas array
            const likes = idea.likes.filter(
                like => like.toString() !== userId.toString()
              );
              idea.likes = likes;
            await idea.save()
            res.send({
                success: true,
                message: 'You like is removed from the idea'
            })
        }
    }  res.send({
        success: false,
        message: 'You idea is not found to be liked'
    })
    
}

const getLikeCountController = async(req,res)=>{
    const id = req.params.id;
    const idea = await Idea.findById(id);

    if(idea){
        const likeCount = idea.likes.length
        res.status(200).send({
            success: true,
            data:likeCount
        })
    }else{
        res.send({
            success: false,
            message: 'You idea is not found to be counted'
        })
    }

}
const getCommentCountController = async(req,res)=>{
    const id = req.params.id;
    const idea = await Idea.findById(id).populate('comments');
    if(idea){
        const commentCount = idea.comments.length;
        res.status(200).send({
            success: true,
            data:commentCount
        })
    }else{
        res.send({
            success: false,
            message: 'You idea is not found to be comment counted'
        })
    }
}



module.exports = {
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

}