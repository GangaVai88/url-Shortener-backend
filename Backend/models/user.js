// The macro-workflow for database schemas is => Import the Database Library => Define Schema Blueprint => Compile and export the model
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email : {
        type: String,
        required : true,
        unique: true
    },
    password : {
        type: String,
        required:true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});
module.exports = mongoose.model('User', userSchema);