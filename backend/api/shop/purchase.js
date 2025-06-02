import dbConnect from '../../_lib/dbConnect';
import User from '../../_lib/models/User';
import Item from '../../_lib/models/Item';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    await dbConnect();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const { itemId } = req.body;
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
        return res.status(401).json({ message: 'Token inválido.' });
    }
}