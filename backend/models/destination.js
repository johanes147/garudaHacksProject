const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['super_priority', 'priority', 'regular'],
        default: 'regular'
    },
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    popularActivities: [String],
    bestTimeToVisit: [String],
    averageCost: {
        budget: String,
        midRange: String,
        luxury: String
    }
});

module.exports = mongoose.model('Destination', destinationSchema);