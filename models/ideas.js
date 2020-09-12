const mongoose = require('mongoose')

const ideaSchema = new mongoose.Schema({
    title : String,
    description: String,
    allowComments:Boolean,
    status:String
    

});

const Idea = mongoose.model('Idea',ideaSchema);

module.exports = Idea;