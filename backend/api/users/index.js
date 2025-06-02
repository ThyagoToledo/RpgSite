import dbConnect from '../../_lib/dbConnect';
import User from '../../_lib/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();
    await dbConnect();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Acesso restrito a administradores.' });
        }
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}