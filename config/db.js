const mongoose = require('mongoose')
module.exports = async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ideas-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Database Connected Successfully');
    } catch (err) {
        console.log(err)
    }
}
