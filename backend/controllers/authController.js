const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário já existe.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
        });
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
    } catch (err) {
        res.status(500).json({ message: 'Erro no registro', error: err.message });
    }
};

exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
        }
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
    } catch (err) {
        res.status(500).json({ message: 'Erro no login', error: err.message });
    }
};

exports.session = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar sessão', error: err.message });
    }
};