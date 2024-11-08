import express from 'express';
import LayoutManager from '../managers/layoutManager.js';

const router = express.Router();
const layoutManager = new LayoutManager();

// GET ALL Layouts
router.get('/layouts', async (req, res) => {
    try {
        const layouts = await layoutManager.getAllLayouts();
        if (!layouts || layouts.length === 0) {
            return res.status(404).json({ message: "Layouts not found" });
        }
        res.json(layouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET layout by ID
router.get('/:id', async (req, res) => {
    try {
        const layout = await layoutManager.getLayoutById(req.params.id);
        if (!layout) return res.status(404).json({ message: "Layout not found" });
        res.json(layout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new layout
router.post('/', async (req, res) => {
    try {
        const newLayout = await layoutManager.createLayout(req.body);
        res.status(201).json(newLayout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE layout by ID
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
