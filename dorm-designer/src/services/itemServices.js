import axios from 'axios';

const API_URL = process.env.API_URL + '/items' || 'http://localhost:5000/api/items';

// Create a new item, make sure type field is filled out, i.e there is a property(enum of legged, floor, wall) called type and it needs to be set, check itemModel in backend
export const createItem = async (itemData) => {
    const response = await axios.post(`${API_URL}/`, itemData);
    return response.data;
};

export const getItemById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const updateItemById = async (id, itemData) => {
    const response = await axios.put(`${API_URL}/${id}`, itemData);
    return response.data;
};

export const deleteItemById = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
