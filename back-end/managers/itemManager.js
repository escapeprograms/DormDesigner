import Item from '../models/itemModel.js';

class ItemManager {
    async createItem(data) {
        const newItem = new Item(data);
        return await newItem.save();
    }

    async getItemById(id) {
        try {
            return await Item.findById(id);
        } catch (error) {
            throw new Error("Item not found");
        }
    }

    async updateItemById(id, data) {
        try {
            const updatedItem = await Item.findByIdAndUpdate(id, data, { new: true }); 
            if (!updatedItem) {
                throw new Error("Failed to update item with the given _id");
            }
            return updatedItem;
        } catch (error) {
            throw new Error("Failed to update item with the given _id");
        }
    }

    async deleteItemById(id) {
        try {
            const deletedItem = await Item.findByIdAndDelete(id); 
            if (!deletedItem) {
                throw new Error("Failed to delete item with the given _id");
            }
            return deletedItem;
        } catch (error) {
            throw new Error("Failed to delete item with the given _id");
        }
    }
}

export default ItemManager;