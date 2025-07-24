const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    departure: {
        type: String,
        required: true
    },
    travelMonth: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    likedDestinations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
    avatar: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);