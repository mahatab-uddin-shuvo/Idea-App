const mongoose = require('mongoose')
 
const url = process.env.LOCAL_DB
const connectDB = async function() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex:true
        });
        console.log('Database Connected Successfully');
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    url,
    connectDB
    
}