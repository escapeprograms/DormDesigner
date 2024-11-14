import Item from '../models/itemModel.js';

class ItemManager {
    async createItem(data) {
        const newItem = new Item(data);
        return await newItem.save();
    }

    async getItemById(id) {
        try {
            const item = await Item.findOne({ id }); // Search by `id` field
            if (!item) {
                throw new Error("Item not found");
            }
            return item;
        } catch (error) {
            throw new Error("Item not found");
        }
    }

    async updateItemById(id, data) {
        try {
            const updatedItem = await Item.findOneAndUpdate({ id }, data, { new: true });
            if (!updatedItem) {
                throw new Error("Failed to update item");
            }
            return updatedItem;
        } catch (error) {
            throw new Error("Failed to update item");
        }
    }

    async deleteItemById(id) {
        try {
            const deletedItem = await Item.findOneAndDelete({ id });
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
