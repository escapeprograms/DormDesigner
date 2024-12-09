import express from 'express';
import DesignManager from '../managers/designManager.js';

const router = express.Router();
const designManager = new DesignManager();

router.get('/:userId', async (req, res) => {
    try {
        const designs = await designManager.getDesignsByUserId(req.params.userId);
        if (designs.length === 0) return 0;
        res.json(designs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const design = await designManager.getDesignById(req.params.id);
        if (!design) return res.status(404).json({ message: "Design not found with the given ID" });
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
        const updatedDesign = await designManager.updateDesignById(req.params.id, req.body);
        if (!updatedDesign) return res.status(404).json({ message: "Design not found with the given _id" });
        res.json(updatedDesign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedDesign = await designManager.deleteDesignById(req.params.id);
        if (!deletedDesign) return res.status(404).json({ message: "Design not found with the given _id" });
        res.json({ message: "Design deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/user/:userId', async (req, res) => {
    try {
        const result = await designManager.deleteDesignsByUserId(req.params.userId);
        if (result.deletedCount === 0) return res.status(404).json({ message: "No designs found for the given UserId" });
        res.json({ message: "All designs deleted successfully for UserId" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete all designs (for all users), only for use when setting up/seeding
router.delete('/', async (req, res) => {
    try {
        await designManager.deleteAllDesigns();
        res.json({ message: "All designs deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
