const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true,
        maxlength:15,
        unique:true
    }
},{
    toObject:{
        virtuals:true
    }
})

//mapping virtual temporary field to get all ideas related category
categorySchema.virtual('ideas',{
    ref:'Idea',
    localField:'category',
    foreignField:'categories.categoryName'
})

const Category = mongoose.model('Category',categorySchema);

module.exports = Category