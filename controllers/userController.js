const _ = require('lodash');
const { id } = require('date-fns/locale');
const sharp = require('sharp');
const fs= require('fs');
const util = require('util');
const nodemailer = require('nodemailer');
const deleteFilePromise  = util.promisify(fs.unlink)
const { generateUserDoc,generateIdeaDoc,generateCategoryDoc } = require('../helpers/docGenate');
const {accountDeleteEmail} = require('../email/account') 
const User =  require('../models/user')
const Category =  require('../models/category')

const mailConfig = require ('../config/mailConfig');
//configuring transport
const transporter = nodemailer.createTransport(mailConfig);

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
        transporter.sendMail(accountDeleteEmail(user.email))  
       console.log("Delete your account");
       req.flash('success_msg','Delete Your Account Successfully')
       res.redirect('/ideas');
   }else{
       req.flash('error_msg','problem occured during deleting your account')
       res.redirect('back');
    }
}


const getUserIdeasController =async (req,res)=>{
   const id  = req.params.id;
   const page = +req.query.page || 1;
   const item_per_page = 1;

   const user = await User.findById(id).populate({
       path:'ideas',
    //    select:'title description',
       options:{
           sort:{
            updatedAt:-1
           }
       }
   });

   //get categories
   const category = await Category.find()
   //creating categories context to avoid hbs error
   const categoriesContext = category.map(category => generateCategoryDoc(category) )
   
  if(user){
      
      //get all ideas and avoid hbs error
      const contextIdeas = user.ideas.map(idea => generateIdeaDoc(idea));
      //filtering public ideas
      const publicIdeas = contextIdeas.filter(idea=>idea.status === 'public')
       // count category public ideas 
       const userePublicIdeaCount = publicIdeas.length;
       //idea to pass (pagination)
       const userPublicIdeasToPass = publicIdeas.splice((page-1)*item_per_page,item_per_page)
     
       res.render('ideas/index',{
       title:`All Ideas By ${user.firstName}`,
       ideas:userPublicIdeasToPass,
       firstName:user.firstName,
       currentPage:page,
       previousPage:page-1,
       nextPage:page+1,
       hasPreviousPage:page > 1,
       hasNextPage:page * item_per_page < userePublicIdeaCount,
       lastPage: Math.ceil(userePublicIdeaCount/item_per_page),
       userRef:true,
       userId:user._id,
       ideasTags:contextIdeas,
       categories:categoriesContext
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