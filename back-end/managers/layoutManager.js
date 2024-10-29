import Layout from '../models/layoutModel.js';

class LayoutManager {
    async getLayoutById(id) {
        try {
            return await Layout.findById(id);
        } catch (error) {
            throw new Error("Layout not found");
        }
    }

    async getAllLayouts() {
        try {
            return await Layout.find(); 
        } catch (error) {
            throw new Error("Failed to retrieve layouts");
        }
    }

    async createLayout(data) {
        const newLayout = new Layout(data);
        return await newLayout.save(); 
    }

    async updateLayoutById(id, data) {
        try {
            return await Layout.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error("Failed to update layout");
        }
    }

    async deleteLayoutById(id) {
        return await Layout.findByIdAndDelete(id);
    }

    async deleteAllLayouts() {
        try {
            return await Layout.deleteMany({}); 
        } catch (error) {
            throw new Error("Failed to delete all layouts");
        }
    }
}

export default LayoutManager;
