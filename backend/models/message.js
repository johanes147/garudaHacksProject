const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['user', 'system', 'ai'],
        default: 'user'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isRead: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Message', messageSchema);