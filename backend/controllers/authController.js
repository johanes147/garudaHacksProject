const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, departure, travelMonth, budget } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const user = new User({
                name,
                email,
                departure,
                travelMonth,
                budget
            });

            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    departure: user.departure,
                    travelMonth: user.travelMonth,
                    budget: user.budget
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    departure: user.departure,
                    travelMonth: user.travelMonth,
                    budget: user.budget
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
                .populate('likedDestinations')
                .populate('groups');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ user });
        } catch (error) {
            res.status(500).json({ message: '# Travel Match Indonesia - Complete Project Structure

## Project Directory Structure