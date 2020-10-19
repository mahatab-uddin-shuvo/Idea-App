const express = require('express')
const router = express.Router();
//contrller 
const {
    homePageController,
    aboutPageController,
    contactPageController,
    notfoundPageController
      } = require('../controllers/pageController')

//middleware
const {ensureGuest}= require('../middleware/authMiddleware')

//home page 
router.get('/',ensureGuest,homePageController );

//about
router.get('/about', aboutPageController);

//contact
router.get('/contact', contactPageController);

//notfound
// router.get('*',notfoundPageController)


module.exports = router