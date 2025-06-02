const Item = require('../models/Item');

exports.getAllItems = async(req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar itens', error: err.message });
    }
};

exports.createItem = async(req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const item = await Item.create({ name, description, price, imageUrl });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar item', error: err.message });
    }
};