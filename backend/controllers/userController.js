const User = require('../models/User');

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: err.message });
    }
};

exports.updateUserTokens = async(req, res) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;
        const user = await User.findByIdAndUpdate(
            userId, { $set: { tokens: amount } }, { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar tokens', error: err.message });
    }
};