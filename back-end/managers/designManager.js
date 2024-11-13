import Design from '../models/designModel.js';

class DesignManager {
    async getDesignByUserId(id) {
        try {
            return await Design.findById(id);
        } catch (error) {
            throw new Error("Design not found");
        }
    }

    async createDesign(data) {
        const newDesign = new Design(data);
        return await newDesign.save(); 
    }

    async updateDesignByUserId(id, data) {
        try {
            return await Design.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error("Failed to update Design");
        }
    }

    async deleteDesignByUserId(id) {
        return await Design.findByIdAndDelete(id);
    }

    async deleteAllDesigns() {
        try {
            return await Design.deleteMany({}); 
        } catch (error) {
            throw new Error("Failed to delete all Designs");
        }
    }
}

export default DesignManager;
