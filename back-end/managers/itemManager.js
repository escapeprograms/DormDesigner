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
            return await Item.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error("Failed to update item");
        }
    }

    async deleteItemById(id) {
        try {
            return await Item.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Failed to delete item");
        }
    }
}

export default ItemManager;
