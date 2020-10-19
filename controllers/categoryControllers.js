const Category = require('../models/category')
const Idea = require('../models/idea')

//helper
const {generateIdeaDoc,generateCategoryDoc} = require('../helpers/docGenate')


const addCategoryController = (req,res)=>{
   res.render('admin/category',{
       title:'Add a Category',
       path: '/categories'
   })
}

const postCategoryController = async(req,res)=>{
    
    const category = new Category (req.body);
    await category.save();
    res.status(200).send({success: true , message : 'category successfully saved'})
};

const getCategoriesController =  async(req,res)=>{
    const categories = await Category.find();
    res.status(200).send({
        success:true,
        categories
    })
}

const deleteCategoryController= async(req,res)=>{
     const categoryName = req.params.cat_name;

    const category = await Category.findOneAndDelete({
        category:categoryName
    });

    if(category){
       res.status(200).send({success:true,message :'category successfully removed'})
    }else{
        res.status(404).send({success:false,message :'category not found'})

    }
}

const getCatIdeasController = async(req,res)=>{
   const catName  = req.params.cat_name;

    //getting all idea
    const ideas = await Idea.find();

    //creating all ideas context to avoid error
    const ideasContext = ideas.map(idea=>generateIdeaDoc(idea))

    // get all categories 
    const categories = await Category.find()
      
    //creating context to avoid hbs errors
    const categoryContext = categories.map(category=>generateCategoryDoc(category))
    

    //const category =  await Category.findOne({category:catName}).populate('ideas')
    
    //finding category
    const category = categories.find(
        category=>category.category === catName);
    
    const matchIdeas =[];
    //mapping ideas related to categories
    ideas.map(idea=>{
        idea.categories.map(eachCat=>{
            if(eachCat.categoryName === category.category){
                matchIdeas.push(idea)
            } 
        })
    })
    
    category.ideas = matchIdeas;
    
   if(category){
       const ideaContext = category.ideas.map(idea=>generateIdeaDoc(idea))
       //finding public ideas form ideacontext
       const publicIdeas =  ideaContext.filter(idea => idea.status === 'public')
      
       res.render('ideas/index',{
           title:`All ideas under ${category.category}`,
           ideas:publicIdeas,
           catName:category.category,
           categories:categoryContext,
           ideasTags:ideasContext,
           catRef:'category'
           
       })
   }else{
    res.status(404).render('pages/NotFound',{
        title:'Not Found'
    })

   }
}

module.exports={
    addCategoryController,
    postCategoryController,
    getCategoriesController,
    deleteCategoryController,
    getCatIdeasController
}