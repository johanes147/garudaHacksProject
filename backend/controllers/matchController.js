const Match = require('../models/Match');
const User = require('../models/User');
const Destination = require('../models/Destination');

const matchController = {
    createMatch: async (req, res) => {
        try {
            const { destinationId, userId } = req.body;

            // Check if user already has a match for this destination
            const existingMatch = await Match.findOne({
                destination: destinationId,
                users: userId
            });

            if (existingMatch) {
                return res.json({ match: existingMatch });
            }

            // Find an existing group with space
            let match = await Match.findOne({
                destination: destinationId,
                groupSize: { $lt: 8 },
                isActive: true
            });

            if (match) {
                // Add user to existing group
                match.users.push(userId);
                match.groupSize += 1;
                await match.save();
            } else {
                // Create new group
                match = new Match({
                    destination: destinationId,
                    users: [userId],
                    groupSize: 1
                });
                await match.save();
            }

            // Update user's groups
            await User.findByIdAndUpdate(userId, {
                $addToSet: { groups: match._id }
            });

            await match.populate('destination users');
            res.json({ match });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getUserMatches: async (req, res) => {
        try {
            const { userId } = req.params;
            
            const matches = await Match.find({ users: userId })
                .populate('destination')
                .populate('users', 'name avatar');

            res.json({ matches });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    likeDestination: async (req, res) => {
        try {
            const { userId, destinationId } = req.body;

            await User.findByIdAndUpdate(userId, {
                $addToSet: { likedDestinations: destinationId }
            });

            res.json({ message: 'Destination liked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    joinGroup: async (req, res) => {
        try {
            const { userId, groupId } = req.body;

            const match = await Match.findById(groupId);
            if (!match) {
                return res.status(404).json({ message: 'Group not found' });
            }

            if (match.groupSize >= match.maxSize) {
                return res.status(400).json({ message: 'Group is full' });
            }

            if (match.users.includes(userId)) {
                return res.status(400).json({ message: 'User already in group' });
            }

            match.users.push(userId);
            match.groupSize += 1;
            await match.save();

            await User.findByIdAndUpdate(userId, {
                $addToSet: { groups: match._id }
            });

            res.json({ message: 'Successfully joined group', match });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = matchController;