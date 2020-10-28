const mongoose = require('mongoose');
const {Comment} =  require('./comment')

const ideaSchema = new mongoose.Schema({
    title : {
       type: String,
       required: [true ,'Title is Required'],
       minlength: [2,'Title Must be 2 Characters long'],
       maxlength: [50,'Title Must be less then 10 Characters long'],
       trim:true
    //    lowercase:true,

    // jodi database save korar age modify kortechai tahole evabe korte hobe
    //    set(v){
    //        return v.toLowerCase() //lowercase save by databse
    //    },
    //    get(v){
    //        return v.toUpperCase() //user show uppercase of title
    //    }
    },
    description: {
        type: String,
        maxlength:10000
        // required:[true ,'Description is Required'],
        //** Specific Word match korte chaile
        // validate: {
        //     validator(v){
        //         return v.toLowerCase().includes('description')
        //     },
        //     message:"Description must contain Word 'Description'"
        // }
    },
    allowComments:{
        type: Boolean,
        required:[true ,'AllowComments is Required']
        // default:true 
        //**the default value is present no need to required value 
    },
    status:{
        type: String,
        required:[true ,'Status is Required'],
        enum:{
            values:['public','private'],
            message: 'Please provide public or private in status'
        }
    },

    categories:[
       {
           categoryName:String
       }
    ],
    
    image:String,

    
    likes:[
        {
            type:mongoose.Types.ObjectId
        }
    ],
 
    tags:[
        {
           type:String,
           required:[true,'Idea must have One Tag']

        }
    ],

    user:{
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'User'
        },
        firstName:String
    }  

},{
    toObject:{
        virtuals:true
    },
    timestamps:true
});

ideaSchema.virtual('comments',{
    ref:'Comment',
    localField:'_id', //idea schemar local field
    foreignField: 'idea' //comments er under jei idea field
})


const Idea = mongoose.model('Idea',ideaSchema);

module.exports = Idea;