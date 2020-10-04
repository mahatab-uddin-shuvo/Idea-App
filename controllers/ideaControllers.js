const express = require('express')
require('express-async-errors')
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const _ = require('lodash');
//doc helper
const {generateIdeaDoc,generateCommentDoc} = require('../helpers/docGenate')

//import Idea database
const Idea = require('../models/idea')

 //get all ideas
 const getIdeasController = async (req, res, next) => {

    //getting all idea
    const ideas = await Idea.find();
    //avoiding handlebars errors related to child and parent referecting
    const contexts = {
        ideasDocuments: ideas.map(idea =>
            generateIdeaDoc(
                idea._id,
                idea.title,
                idea.description,
                idea.allowComments,
                idea.status,
                idea.tags,
                idea.comments
            ))
    };
    res.render('ideas/index', {
        ideas: contexts.ideasDocuments,
        title: 'All Ideas', 
        path: '/ideas'

    });
};

//show form to add idea
const addIdeaController =  (req, res, next) => {
    res.render('ideas/new', {
        title: 'Add Idea',
        path:'/ideas/new'
    })
}

//show edit idea form
const editIdeaController = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.render('pages/NotFound')
    }
    const idea = await Idea.findById(id)

    if (idea) {
        const ideasDocument = generateIdeaDoc(
            idea._id,
            idea.title,
            idea.description,
            idea.allowComments,
            idea.status,
            idea.tags,
            idea.comments
        )
        res.render('ideas/edit', {
            title: 'Edit title',
            idea: ideasDocument
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
        allowComments:req.allowComments
    })
  await idea.save()
  console.log(idea);
  req.flash('success_msg','Idea Added Successfully')
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
    const idea = await Idea.findById(id);
    //Generating Comment Contexts to hbs error
    if(idea.comments){
        contextComments = idea.comments.map(
           comment =>generateCommentDoc(
               comment._id,comment.title,comment.text))
    } 

    if (idea) {
        const ideasDocument = generateIdeaDoc(
            idea._id,
            idea.title,
            idea.description,
            idea.allowComments, 
            idea.status,
            idea.tags,
            contextComments
        )
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
    req.body.allowComments = req.allowComments;
    req.body.tags = req.body.tags.split(',');
    const pickedValue = _.pick(req.body, [
        'title',
        'description',
        'allowComments',
        'status',
        'tags'
    ]);
    console.log("Updated data")
    console.log(pickedValue)

    const idea = await Idea.findByIdAndUpdate(id, pickedValue);
    if (idea) {
        req.flash('success_msg','Idea Updated Successfully')
        res.redirect(`/ideas/${id}`); 
    } else {
        res.status(404).render('pages/NotFound')

    }
}

//delete idea
const deleteIdeaController =  async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.render('pages/NotFound')
    }

    const idea = await Idea.findByIdAndDelete(id)
    console.log('Deleted Data')
    if (idea) {
        req.flash('success_msg','Idea Deleted Successfully')
        res.redirect('/ideas');

    } else {
        res.status(404).render('pages/NotFound')
    }
}

module.exports = {
    getIdeasController,
    addIdeaController,
    editIdeaController,
    postIdeaController,
    getIdeaController,
    updateIdeaController,
    deleteIdeaController

}