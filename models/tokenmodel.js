const mongoose = require('mongoose')

const { Schema } = mongoose;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: Date.now,
        expires: 43200
    },


});

module.exports = mongoose.model('Token', tokenSchema);