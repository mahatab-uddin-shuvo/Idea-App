const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose')

const app = express();
const { compareValues, truncateContent } = require('./helpers/hbs')
const Idea = require('./models/ideas');
//database Connection
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ideas-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify:false
        });
        console.log('Database Connected Successfully');
    } catch (err) {
        console.log(err)
    }
}

connectDB();

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

let ideas = [
    {
        id: 1,
        title: 'Idea 1',
        description: 'Idea 1 Description',
        allowComments: true,
        status: 'public'
    },
    {
        id: 2,
        title: 'Idea 2',
        description: 'Idea 2 Description',
        allowComments: false,
        status: 'public'
    },
    {
        id: 3,
        title: 'Idea 3',
        description: 'Idea 3 Description',
        allowComments: true,
        status: 'private'
    }
]

function genarateIdeaDoc(id, title, description) {
    return {
        id,
        title,
        description
    }
}

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

//get all ideas
app.get('/ideas', async (req, res) => {
    try {
        //getting all idea
        const ideas = await Idea.find();
        //avoiding handlebars errors related to child and parent referecting
        const contexts = {
            ideasDocuments: ideas.map(idea =>
                genarateIdeaDoc(idea._id, idea.title, idea.description))
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

app.get('/ideas/:id/edit', async(req, res) => {
    const id = req.params.id;
    try{
        const idea =await Idea.findById(id)
        const ideasDocument = genarateIdeaDoc(idea._id,idea.title,idea.description)
        if (idea) {
            res.render('ideas/edit', {
                title: 'Edit title',
                idea:ideasDocument
            })
        } else {
            res.render('NotFound')
        }
    }catch(err){
        console.log(err)
        res.render('error')
    }
    
})

//add idea
app.post('/ideas', async(req, res) => {
    try{
        const allowComments = req.body.allowComments ? true : false
    //1    
        const idea = new Idea ({
             ...req.body,
             allowComments
         })
         await idea.save()

    // 2.    Idea.create({
    //         ...req.body,
    //         allowComments
    //     })

         //redirect
         res.redirect('/ideas');
    }catch(err){
        console.log(err);
        res.render('error');
    }
    
})

//show single route
app.get('/ideas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        //get the idea
        const idea = await Idea.findById(id);
        const ideasDocument = genarateIdeaDoc(idea._id, idea.title, idea.description)

        if (idea) {
            res.render('ideas/show', {
                title: "Single Idea",
                idea: ideasDocument
            });
        } else {
            res.render('NotFound')
        }
    } catch (err) {
        console.log(err)
        res.render('error')
    }

})

//update idea
app.put('/ideas/:id',async (req, res) => {
    const id = req.params.id;
    const allowComments = req.body.allowComments ? true : false
    console.log(allowComments)
    req.body.allowComments= allowComments;
    
    const pickedValue = _.pick(req.body, [
        'title',
        'description',
        'allowComments',
        'status'
    ]);
    console.log(pickedValue)
    try{
       const idea = await Idea.findByIdAndUpdate(id,pickedValue);
        if(idea){
            res.redirect(`/ideas/${id}`);
        } else {
            res.render('NotFound')
    
        }
    }catch(err){
        console.log(err);
        res.render('error')
    }
   

});

//delete idea
app.delete('/ideas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    //get the idea
    const idea = ideas.find(idea => idea.id === id);
    if (idea) {
        //remove the idea
        ideas = ideas.filter(idea => idea.id !== id);
        res.redirect('/ideas');

    } else {
        res.render('NotFound')
    }

})

app.get('*', (req, res) => {
    res.status(404).render('NotFound');
});


// create server and listening to port
app.listen('5000', () => {
    console.log("Server is Listeninng on port 5000");
});