const Destination = require('../models/Destination');

const destinationController = {
    getAllDestinations: async (req, res) => {
        try {
            const destinations = await Destination.find().sort({ category: 1, name: 1 });
            res.json({ destinations });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getDestination: async (req, res) => {
        try {
            const destination = await Destination.findById(req.params.id);
            if (!destination) {
                return res.status(404).json({ message: 'Destination not found' });
            }
            res.json({ destination });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    searchDestinations: async (req, res) => {
        try {
            const { query } = req.params;
            const destinations = await Destination.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { province: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            });
            res.json({ destinations });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = destinationController;