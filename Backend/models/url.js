const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    urlCode : {
        type: String,
        required: true,
        unique: true
    },
    longUrl : {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default : Date.now
    }
}); //  constructor is used to define the blueprint for your data in MongoDB. It specifies exactly what fields a document should have, what data types those fields should use, and any validation rules or default values

module.exports = mongoose.model('Url', urlSchema,'urls');
