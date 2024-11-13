import express from 'express';
import ItemManager from '../managers/itemManager.js';

const router = express.Router();
const itemManager = new ItemManager();

// GET item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await itemManager.getItemById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new item
router.post('/', async (req, res) => {
    try {
        const newItem = await itemManager.createItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update item by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await itemManager.updateItemById(req.params.id, req.body);
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE item by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await itemManager.deleteItemById(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
