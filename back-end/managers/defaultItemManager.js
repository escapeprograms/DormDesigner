import DefaultItem from '../models/defaultItemModel.js';

class DefaultItemManager {
    //create and delete is only meant to be used on backend for creation and setting up, there is no route for it so service is only to pull an defaultItem

    async createDefaultItem(data) {
        const newItem = new DefaultItem(data);
        return await newItem.save();
    }

    async getDefaultItemById(id) {
        try {
            const item = await DefaultItem.findOne({ id }); // Search by `id` field
            if (!item) {
                throw new Error("Item not found");
            }
            return item;
        } catch (error) {
            throw new Error("Item not found");
        }
    }

    async deleteDefaultItemById(id) {
        try {
            const deletedItem = await DefaultItem.findOneAndDelete({ id });
            if (!deletedItem) {
                throw new Error("Failed to delete item");
            }
            return deletedItem;
        } catch (error) {
            throw new Error("Failed to delete item");
        }
    }
}


export default ItemManager;
