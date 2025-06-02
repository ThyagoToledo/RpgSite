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
    // Login especial para admin Mestre
    if (username === 'Mestre' && password === 'Cyberpunk2077') {
        let user = await User.findOne({ username: 'Mestre' });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({ username: 'Mestre', password: hashedPassword, isAdmin: true });
        } else if (!user.isAdmin) {
            user.isAdmin = true;
            await user.save();
        }
        const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );
        return res.json({
            user: {
                id: user._id,
                username: user.username,
                tokens: user.tokens,
                isAdmin: user.isAdmin,
            },
            token,
        });
    }
    // Login normal
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
    }
    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({
        user: {
            id: user._id,
            username: user.username,
            tokens: user.tokens,
            isAdmin: user.isAdmin,
        },
        token,
    });
}