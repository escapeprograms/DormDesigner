import express from 'express';
import DefaultItemManager from '../managers/defaultItemManager.js';

const router = express.Router();
const itemManager = new DefaultItemManager();

// GET default item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await itemManager.getDefaultItemById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
