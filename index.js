const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const { compareValues, truncateContent } = require('./helpers/hbs')
const Idea = require('./models/ideas');

//database Connection
const connectDB = require('./config/db')
//doc helper
const genarateIdeaDoc = require('./helpers/docGenate')

connectDB()
const app = express();


app.engine('.hbs', exphbs({
    extname: '.hbs',
    helpers: {
        compareValues,
        truncateContent
    }
}));
app.set('view engine', '.hbs');

//middleware
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))




//home page 
app.get('/', (req, res) => {
    res.render('index', {
        text: 'Hello from node.js',
        title: 'Home page'
    });
});

//about
app.get('/about', (req, res) => {
    res.render('about', {
        text: 'know About us',
        title: 'about us'
    })
});
//contact
app.get('/contact', (req, res) => {
    res.render('contact', {
        text: 'Contact us',
        title: 'Contact us'
    })
});

//get all ideas
app.get('/ideas', async (req, res) => {
    try {
        //getting all idea
        const ideas = await Idea.find();
        //avoiding handlebars errors related to child and parent referecting
        const contexts = {
            ideasDocuments: ideas.map(idea =>
                genarateIdeaDoc(
                    idea._id,
                    idea.title,
                    idea.description,
                    idea.allowComments,
                    idea.status
                ))
        };
        res.render('ideas/index', {
            ideas: contexts.ideasDocuments,
            title: 'All Ideas',
            path: '/ideas'

        });
    } catch (err) {
        res.send(err.message)
        res.status(500).render('error');
    }

});

//show form to add idea

app.get('/ideas/new', (req, res) => {
    res.render('ideas/new', {
        title: 'Add Idea'
    })
});

//show edit idea form

app.get('/ideas/:id/edit', async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.render('NotFound')
    }
    try {
        const idea = await Idea.findById(id)
        
        if (idea) {
            const ideasDocument = genarateIdeaDoc(
                idea._id,
                idea.title,
                idea.description,
                idea.allowComments,
                idea.status
            )
            res.render('ideas/edit', {
                title: 'Edit title',
                idea: ideasDocument
            })
        } else {
            res.status(404).render('NotFound')
        }
    } catch (err) {
        console.log(err)
        res.status(500).render('error')
    }

})

//add idea
app.post('/ideas', [
    check('title')
        .notEmpty()
        .withMessage('title must be required')
        .isLength({ min: 2, max: 50 })
        .withMessage('title must be 2 to 50 character long')
        .trim(),

    check('description', 'Description must be less then 10000 character')
        .isLength({ max: 1000 }),

    check('status')
        .notEmpty()
        .withMessage('status is required')
        .isIn(['public', 'private'])
        .withMessage('Status must be public or private')
],  async (req, res) => {
        const errors = validationResult(req)
        //console.log(errors.array())
        const allowComments = req.body.allowComments ? true : false

        if (!errors.isEmpty()) {
            return res.render('ideas/new', {
                title: 'Add Idea',
                errMsg: errors.array()[0].msg,
                idea: {
                    title: req.body.title,
                    description: req.body.description,
                    allowComments,
                    status: req.body.status
                }
            })

        }

        //1    
        const idea = new Idea({
            ...req.body,
            allowComments
        })
        try {
            await idea.save()

            // 2.    Idea.create({
            //         ...req.body,
            //         allowComments
            //     })

            //redirect
            res.redirect('/ideas');
        } catch (err) {
            console.log(err)
            for (field in err.errors) {
                console.log(err.errors[field].path,
                    err.errors[field].message)
            }
            res.status(500).render('error');
        }

    })

//show single route
app.get('/ideas/:id', async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.render('NotFound')
    }
    try {
        //get the idea
        const idea = await Idea.findById(id);
       

        if (idea) {
            const ideasDocument = genarateIdeaDoc(
                idea._id, 
                idea.title, 
                idea.description,
                idea.allowComments,
                idea.status
                )
            res.render('ideas/show', {
                title: "Single Idea",
                idea: ideasDocument
            });
        } else {
            res.status(404).render('NotFound')
        }
    } catch (err) {
        console.log(err)
        res.status(500).render('error')
    }

})

//update idea
app.put('/ideas/:id', [
    check('title')
        .notEmpty()
        .withMessage('title must be required')
        .isLength({ min: 2, max: 50 })
        .withMessage('title must be 2 to 50 character long')
        .trim(),

    check('description', 'Description must be less then 10000 character')
        .isLength({ max: 1000 }),

    check('status')
        .notEmpty()
        .withMessage('status is required')
        .isIn(['public', 'private'])
        .withMessage('Status must be public or private')
], async (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req)

    //1.   // const allowComments = req.body.allowComments ? true : false      
    // console.log(allowComments)

    // req.body.allowComments=allowComments
    //2. 
    if (req.body.allowComments === 'on') {
        req.body.allowComments = true
    } else {
        req.body.allowComments = false
    }
    const pickedValue = _.pick(req.body, [
        'title',
        'description',
        'allowComments',
        'status'
    ]);
    console.log(pickedValue)

    if (!errors.isEmpty()) {
        return res.render('ideas/edit', {
            title: 'Edit Idea',
            errMsg: errors.array()[0].msg,
            idea: {
                id,
                title: req.body.title,
                description: req.body.description,
                allowComments: req.body.allowComments,
                status: req.body.status
            }

        })
    }
    try {
        const idea = await Idea.findByIdAndUpdate(id, pickedValue);
        if (idea) {
            res.redirect(`/ideas/${id}`);
        } else {
            res.status(404).render('NotFound')

        }
    } catch (err) {
        console.log(err);
        res.status(500).render('error')
    }


});

//delete idea
app.delete('/ideas/:id', async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.render('NotFound')
    }
    try {
        
        const idea = await Idea.findByIdAndDelete(id)
        if (idea) {
            res.redirect('/ideas');

        } else {
            res.status(404).render('NotFound')
        }
    } catch (err) {
        console.log(err);
        res.status(500).render('error')
    }


})

app.get('*', (req, res) => {
    res.status(404).render('NotFound');
});


// create server and listening to port
app.listen('5000', () => {
    console.log("Server is Listeninng on port 5000");
});