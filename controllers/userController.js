const _ = require('lodash');
const { id } = require('date-fns/locale');
const sharp = require('sharp');
const fs= require('fs')
const util = require('util')
const deleteFilePromise  = util.promisify(fs.unlink)

const { generateUserDoc,generateIdeaDoc } = require('../helpers/docGenate');
const User =  require('../models/user')

const getUserController = async(req,res)=>{

   const user = await User.findById(req.user._id)
 
    if(user){
    const userDoc = generateUserDoc(user)

      res.render('users/profile',{
          title:`Profile of ${user.firstName}`,
          path: '/users/me',
          user:userDoc
      })
   }else{
    res.status(404).render('pages/NotFound',{
        title:'Not Found'
    });
   }
}

const editUserController = async(req,res)=>{
    const user =  await User.findById(req.user._id);
 
    if(user){
        const userDoc = generateUserDoc(user);
        res.render('users/edit-profile',{
            title:`Edit Profile of ${user.firstName}`,
            userInput:userDoc,
            path:'/users/me'
        })
    }
    else{
        res.status(404).render('pages/NotFound',{
            title:'Not Found'
        });
       }
}

const updateUserController = async(req,res)=>{
    
    const pickedValue = _.pick(req.body, [
        'firstName',
        'lastName'
    ]);
        
    if(req.file){
        const filename = Date.now() + req.file.originalname

        //resize image 
      await sharp(req.file.buffer)
        .resize({
            width:300,
            height:300
        })
        //.png()
        .toFile(`./uploads/${filename}`)

        //modified picked value obj and add image field value
        pickedValue.image = filename;
        //already user logged in google , unsetting the imageURL field
        if(req.user.imageURL){
            req.user.imageURL = undefined
            await req.user.save({validateBeforeSave: false})
        }
        //deleting existing image
        if(req.user.image){
            deleteFilePromise(`./uploads/${req.user.image}`)
        }
    }
    console.log(pickedValue);

    const user = await User.findByIdAndUpdate(req.user._id,pickedValue);

    if(user){
        req.flash('success_msg','Profile Updated Successfully')
        res.redirect('/users/me'); 
  } else {
      res.status(404).render('pages/NotFound')
  }
    
}

const deleteUserController =async (req,res)=>{
   const user = await req.user.remove();
   if(user.image){
       deleteFilePromise(`./uploads/${user.image}`)
   }

   if(user){
       req.logout();
       req.flash('success_msg','Delete Your Account Successfully')
       res.redirect('/ideas');
   }else{
       req.flash('error_msg','problem occured during deleting your account')
       res.redirect('back');
    }
}


const getUserIdeasController =async (req,res)=>{
   const id  = req.params.id;
  const user = await User.findById(id).populate('ideas');
  if(user){
      //get all ideas and avoid hbs error
      const contextIdeas = user.ideas.map(idea => generateIdeaDoc(idea));
      //filtering public ideas
      const publicIdeas = contextIdeas.filter(idea=>idea.status === 'public')
   res.render('ideas/index',{
       title:`All Idas By ${user.firstName}`,
       ideas:publicIdeas,
       firstName:user.firstName,
       userRef:true
   })
  }else{
    res.status(404).render('pages/NotFound')

  }
}

const dashboardController = async(req,res)=>{
    const user =  await User.findById(req.user._id).populate('ideas');
    if(user){
        const contextIdeas = user.ideas.map(idea => generateIdeaDoc(idea))
        res.render('users/dashboard',{
            title:`All Ideas By ${user.firstName}`,
            ideas:contextIdeas,
            path:'/users/me/ideas'
        });
    }else{
        res.status(404).render('pages/NotFound')
      }
}

module.exports =  {
    getUserController,
    editUserController,
    updateUserController,
    deleteUserController,
    getUserIdeasController,
    dashboardController
}