import Design from '../models/designModel.js';

class DesignManager {
    async getDesignsByUserId(userId) {
        try {
            return await Design.find({ userId: userId });
        } catch (error) {
            throw new Error("Designs not found for the given UserId");
        }
    }

    async createDesign(data) {
        const newDesign = new Design(data);
        return await newDesign.save();
    }

    async updateDesignById(id, data) {
        try {
            return await Design.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error("Failed to update Design with the given _id");
        }
    }

    async deleteDesignById(id) {
        try {
            return await Design.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Failed to delete Design with the given _id");
        }
    }

    async deleteDesignsByUserId(userId) {
        try {
            return await Design.deleteMany({ userId: userId });
        } catch (error) {
            throw new Error("Failed to delete designs for the given UserId");
        }
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

