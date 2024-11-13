import express from 'express';
import DesignManager from '../managers/designManager.js';

const router = express.Router();
const designManager = new DesignManager();

router.get('/:id', async (req, res) => {
    try {
        const design = await designManager.getDesignByUserId(req.params.id);
        if (!design) return res.status(404).json({ message: "Design not found" });
        res.json(design);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newDesign = await designManager.createDesign(req.body);
        res.status(201).json(newDesign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedDesign = await designManager.updateDesignByUserId(req.params.id, req.body);
        if (!updatedDesign) return res.status(404).json({ message: "Design not found" });
        res.json(updatedDesign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedDesign = await designManager.deleteDesignByUserId(req.params.id);
        if (!deletedDesign) return res.status(404).json({ message: "Design not found" });
        res.json({ message: "Design deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
