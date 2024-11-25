import DefaultItem from '../models/defaultItemModel.js';

class DefaultItemManager {
    //create and delete is only meant to be used on backend for creation and setting up, there is no route for it so service is only to pull an defaultItem

    async createDefaultItem(data) {
        const newItem = new DefaultItem(data);
        return await newItem.save();
    }

    async getDefaultItemById(id) {
        try {
            return await DefaultItem.findById(id);
        } catch (error) {
            throw new Error("Item not found");
        }
    }

    async deleteDefaultItemById(id) {
        try {
            const deletedItem = await DefaultItem.findByIdAndDelete(id); 
            if (!deletedItem) {
                throw new Error("Failed to delete item with the given _id");
            }
            return deletedItem;
        } catch (error) {
            throw new Error("Failed to delete item with the given _id");
        }
    }
}


export default DefaultItemManager;
