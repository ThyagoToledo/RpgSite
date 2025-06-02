import dbConnect from '../../_lib/dbConnect';
import User from '../../_lib/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'PUT') return res.status(405).end();
    await dbConnect();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await User.findById(decoded.id);
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({ message: 'Acesso restrito a administradores.' });
        }
        const { userId } = req.query;
        const { amount } = req.body;
        const user = await User.findByIdAndUpdate(
            userId, { $set: { tokens: amount } }, { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.json(user);
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}