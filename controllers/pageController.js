

//home page
const homePageController = (req, res) => {
    res.render('pages/index', {
        text: 'Hello from node.js',
        title: 'Home page'
    });
}

//about page
const aboutPageController = (req, res) => {
    res.render('pages/about', {
        text: 'know About us',
        title: 'about us',
        path: '/about'
    })
}

//contact page 
const contactPageController = (req, res) => {
    res.render('pages/contact', {
        text: 'Contact us',
        title: 'Contact us',
        path: '/contact'
    })
}

//notfound page
const notfoundPageController = (req, res) => {
    res.status(404).render('pages/NotFound');
}

module.exports = {
    homePageController,
    aboutPageController,
    contactPageController,
    notfoundPageController
}
