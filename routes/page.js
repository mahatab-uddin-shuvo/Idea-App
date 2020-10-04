const express = require('express')
const router = express.Router();
//contrller 
const {
    homePageController,
    aboutPageController,
    contactPageController,
    notfoundPageController
      } = require('../controllers/pageController')

//home page 
router.get('/',homePageController );

//about
router.get('/about', aboutPageController);

//contact
router.get('/contact', contactPageController);

//notfound
// router.get('*',notfoundPageController)


module.exports = router