const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
firstname: {
    type: String, 
    trim: true, 
    required: true
},

lastname: {
    type: String, 
    trim: true, 
    required: true
},

email: {
    type: String, 
    trim: true, 
    required: true
},

password: {
    type: String, 
    trim: true, 
    required: true
},


},{
    timestamp: true

});

module.exports = mongoose.model('users', userSchema);