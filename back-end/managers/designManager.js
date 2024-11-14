import Design from '../models/designModel.js';

class DesignManager {
    async getDesignById(id) {
        try {
            return await Design.findById(id);
        } catch (error) {
            throw new Error("Layout not found");
        }
    }
    
    async getDesignsByUserId(userId) {
        try {
            return await Design.find({ userId: { $eq: userId } });
        } catch (error) {
            throw new Error("Designs not found for the given UserId");
        }
    }

    async createDesign(data) {
        console.log(data)
        const newDesign = new Design(data);
        console.log(newDesign)
        return await newDesign.save();
    }

    async updateDesignById(id, data) {
        try {
            const updatedDesign = await Design.findByIdAndUpdate(id, data, { new: true }); 
            if (!updatedDesign) {
                throw new Error("Failed to update Design with the given _id");
            }
            return updatedDesign;
        } catch (error) {
            throw new Error("Failed to update Design with the given _id");
        }
    }


    async deleteDesignById(id) {
        try {
            const deletedDesign = await Design.findByIdAndDelete(id); 
            if (!deletedDesign) {
                throw new Error("Failed to delete Design with the given _id");
            }
            return deletedDesign;
        } catch (error) {
            throw new Error("Failed to delete Design with the given _id");
        }
    }

    async deleteDesignsByUserId(userId) {
        try {
            return await Design.deleteMany({ userId: { $eq: userId } }); 
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
