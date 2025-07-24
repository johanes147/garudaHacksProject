const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    groupSize: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    },
    maxSize: {
        type: Number,
        default: 8
    },
    groupName: String,
    groupAvatar: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Match', matchSchema);