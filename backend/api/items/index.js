import dbConnect from '../../_lib/dbConnect';
import Item from '../../_lib/models/Item';
import User from '../../_lib/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'GET') {
        // Listar todos os itens
        const items = await Item.find();
        return res.json(items);
    }
    if (req.method === 'POST') {
        // Criar item (apenas admin)
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
            const { name, description, price, imageUrl } = req.body;
            const item = await Item.create({ name, description, price, imageUrl });
            return res.status(201).json(item);
        } catch (err) {
            return res.status(401).json({ message: 'Token inválido.' });
        }
    }
    return res.status(405).end();
}