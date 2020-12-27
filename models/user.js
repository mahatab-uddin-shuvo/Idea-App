const { truncate, isLength } = require('lodash')
const mongoose =  require('mongoose')
const bcrypt = require('bcryptjs')
const fs= require('fs')
const util = require('util')
const deleteFilePromise  = util.promisify(fs.unlink)


//model 
const Idea = require('./idea')

const userSchema = new mongoose.Schema({
    googleID:{
        type:String
    },
     
    firstName:{
        type:String,
        trim:true,
        required: true,
        maxlength: 20
    },
    lastName:{
        type:String,
        trim:true,
        required: true,
        maxlength: 20
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate:{
            validator(v){
                v.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2-5})$/)
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:50,
        validate:{
            validator(v){
                const passArray = ['password','123456','god123']
                //some method return by true or false based on condition
                const isMatch =  passArray.some(pass => v.includes(pass))
                if(isMatch) return false
            }
        }
    },
    resetPasswordToken : String,
    image:String,
    imageURL:String,
    role:{
        type:Number,
        default:0
    }
},{
    toObject:{
        virtuals:true
    }
})

userSchema.virtual('ideas',{
    ref:'Idea',
    localField:'_id',
    foreignField: 'user.id'
})

userSchema.pre('save',async function(next) {
  if(this.isModified('password')){
    const hashPassword = await bcrypt.hash(this.password,12)
    this.password = hashPassword
    next()
  }else{
      next()
  }
  
})

userSchema.pre('remove',async function(next){
    const user = this;
    const id = user._id;

    //get all ideas
    const ideas = await Idea.find({'user.id':id})

    //inside loop (with callback) don't support promise
    ideas.map(idea=>{  
        //remove idea image deleting after idea
        if(idea.image){
            deleteFilePromise(`./uploads/ideas/${idea.image}`)
        }
    })


     await Idea.deleteMany({
        'user.id' : id
    })
    console.log('Success all idea Delete by account')
    next()
})


const User =  mongoose.model('User', userSchema) ;

module.exports = User