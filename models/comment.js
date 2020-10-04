const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlength: 100,
        trim:true
    },
    text:{
        type:String,
        maxlength:1000
    }    
})

const Comment = mongoose.model('Comment',commentSchema);

module.exports ={
    Comment,
    commentSchema
}