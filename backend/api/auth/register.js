import dbConnect from '../_lib/dbConnect';
import User from '../_lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    await dbConnect();
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Nome de usuário já existe.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET, { expiresIn: '7d' }
    );
    res.status(201).json({
        user: {
            id: user._id,
            username: user.username,
            tokens: user.tokens,
            isAdmin: user.isAdmin,
        },
        token,
    });
}