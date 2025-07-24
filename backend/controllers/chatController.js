const Message = require('../models/Message');
const Match = require('../models/Match');
const User = require('../models/User');

const chatController = {
    getMessages: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { page = 1, limit = 50 } = req.query;

            const messages = await Message.find({ group: groupId })
                .populate('sender', 'name avatar')
                .sort({ timestamp: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            res.json({ messages: messages.reverse() });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    sendMessage: async (req, res) => {
        try {
            const { groupId } = req.params;
            const { senderId, message, type = 'user' } = req.body;

            const newMessage = new Message({
                sender: senderId,
                group: groupId,
                message,
                type
            });

            await newMessage.save();
            await newMessage.populate('sender', 'name avatar');

            // Emit real-time message via Socket.io
            req.app.get('io').to(groupId).emit('new-message', newMessage);

            res.status(201).json({ message: newMessage });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getUserGroups: async (req, res) => {
        try {
            const { userId } = req.params;

            const groups = await Match.find({ users: userId })
                .populate('destination', 'name emoji image province')
                .populate('users', 'name avatar')
                .sort({ createdAt: -1 });

            res.json({ groups });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getAIResponse: async (req, res) => {
        try {
            const { question, destination, userProfile } = req.body;

            // Simple AI response logic (in production, integrate with OpenAI API)
            const aiResponse = generateContextualResponse(question, destination, userProfile);

            res.json({ response: aiResponse });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

function generateContextualResponse(question, destination, userProfile) {
    const lowerQuestion = question.toLowerCase();
    
    const responses = {
        weather: `Pada bulan ${userProfile.travelMonth}, ${destination.name} biasanya memiliki cuaca yang menyenangkan. Bawa pakaian yang nyaman dan sepatu yang cocok untuk berjalan!`,
        budget: `Untuk budget ${userProfile.budget}, Anda bisa menikmati akomodasi menengah dan pengalaman lokal yang menarik di ${destination.name}!`,
        safety: `${destination.name} umumnya aman untuk wisatawan. Ikuti saja tips keamanan standar saat bepergian!`,
        transport: `Berkeliling ${destination.name} mudah dengan berbagai pilihan transportasi lokal. Saya rekomendasikan untuk mendapat kartu transportasi!`,
        culture: `${destination.name} memiliki tradisi budaya yang kaya. Hormati adat istiadat lokal saat mengunjungi tempat-tempat bersejarah!`,
        food: `Kuliner di ${destination.name} sangat beragam! Jangan lewatkan makanan khas lokal dan warung-warung tradisional!`,
        activity: `Ada banyak aktivitas menarik di ${destination.name}. Dari wisata alam hingga budaya, semuanya bisa dinikmati sesuai minat Anda!`
    };

    if (lowerQuestion.includes('cuaca') || lowerQuestion.includes('weather')) {
        return responses.weather;
    } else if (lowerQuestion.includes('budget') || lowerQuestion.includes('biaya')) {
        return responses.budget;
    } else if (lowerQuestion.includes('aman') || lowerQuestion.includes('safety')) {
        return responses.safety;
    } else if (lowerQuestion.includes('transport') || lowerQuestion.includes('transportasi')) {
        return responses.transport;
    } else if (lowerQuestion.includes('budaya') || lowerQuestion.includes('culture')) {
        return responses.culture;
    } else if (lowerQuestion.includes('makanan') || lowerQuestion.includes('kuliner')) {
        return responses.food;
    } else if (lowerQuestion.includes('aktivitas') || lowerQuestion.includes('kegiatan')) {
        return responses.activity;
    }
    
    return `Untuk ${destination.name}, saya rekomendasikan mengunjungi tempat-tempat menarik dan mencoba pengalaman lokal yang autentik!`;
}

module.exports = chatController;