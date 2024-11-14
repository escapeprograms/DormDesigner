import express from 'express';
import LayoutManager from '../managers/layoutManager.js';

const router = express.Router();
const layoutManager = new LayoutManager();

router.get('/:id', async (req, res) => {
    try {
        const layout = await layoutManager.getLayoutById(req.params.id);
        if (!layout) return res.status(404).json({ message: "Layout not found" });
        res.json(layout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newLayout = await layoutManager.createLayout(req.body);
        res.status(201).json(newLayout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedLayout = await layoutManager.updateLayoutById(req.params.id, req.body);
        if (!updatedLayout) return res.status(404).json({ message: "Layout not found" });
        res.json(updatedLayout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedLayout = await layoutManager.deleteLayoutById(req.params.id);
        if (!deletedLayout) return res.status(404).json({ message: "Layout not found" });
        res.json({ message: "Layout deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
