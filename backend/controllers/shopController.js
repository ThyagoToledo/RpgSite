const User = require('../models/User');
const Item = require('../models/Item');

exports.purchase = async(req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }
        if (user.tokens < item.price) {
            return res.status(400).json({ message: 'Tokens insuficientes.' });
        }
        user.tokens -= item.price;
        await user.save();
        res.json({ user: { id: user._id, username: user.username, tokens: user.tokens, isAdmin: user.isAdmin }, item });
    } catch (err) {
        res.status(500).json({ message: 'Erro na compra', error: err.message });
    }
};