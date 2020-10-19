const express = require('express');
require('express-async-errors')
require('dotenv').config()
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash')

//configuring passport 
require('./config/passport').localStrategy(passport)
require('./config/passport').googleStrategy(passport)


const {
    compareValues, 
    truncateContent,
    comparePath,
    displayBtn,
    formatDate 
    } = require('./helpers/hbs')

//database Connection
const {connectDB,url} = require('./config/db')

//Import Route config 
const ideaRoutes =  require('./routes/idea')
const pageRoutes =  require('./routes/page')
const authRoutes =  require('./routes/auth')
const commentRoutes =  require('./routes/comment')
const userRoutes =  require('./routes/user')
const categoryRoutes =  require('./routes/category')

//Import NotFound Controller
const {notfoundPageController} = require('./controllers/pageController')

//import middleware
const errorMiddleware =  require('./middleware/errorMiddleware')

const store = new MongoStore({
    url
})
//connecting
connectDB()

const app = express();


app.engine('.hbs', exphbs({
    extname: '.hbs',
    helpers: {
        compareValues,
        truncateContent,
        comparePath,
        displayBtn,
        formatDate
    }
}));
app.set('view engine', '.hbs');

//middleware
app.use(session({
    secret:process.env.SESSION_SECRET,
    store,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge : 2 * 60 * 100 * 1000,
        httpOnly: true,
        sameSite:'lax'
    }
}))

app.use(flash())
app.use(express.json())

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

// const isAuth = (req,res,next)=>{
//    console.log(req.cookies.isLoggedIn);
//    if(req.cookies.isLoggedIn === 'true'){
//     next()
//     }
//    else{
//        res.render('auth/login',{
//            title:'Login Idea'
//        })
//    }

// if(req.session.isLoggedIn === 'true'){
//     next()
// }else{
//     res.redirect('/auth/login')
// }
// }

app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    res.locals.user_id = (req.user && req.user._id) || null;
    res.locals.firstName = (req.user && req.user.firstName) || null;
    res.locals.isAdmin =(req.user && req.user.role)|| null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    next()
})


//route middleware
app.use('/',pageRoutes);
app.use('/auth',authRoutes);
app.use('/users',userRoutes);
app.use('/categories',categoryRoutes);
app.use('/ideas',ideaRoutes);
app.use('/ideas/:id/comments',commentRoutes);

//notFound
app.use('*',notfoundPageController)


//error handaling middleware
app.use(errorMiddleware)

// create server and listening to port
app.listen('5050', () => {
    console.log("Server is Listeninng on port 5050");
});