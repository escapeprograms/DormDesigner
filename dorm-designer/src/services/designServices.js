import axios from 'axios';

const API_URL = 'http://localhost:3000/api/design';

// NOTE: When retrieving designs, to update indivdually after pulling by userId, use the available id property (not userId) in the other functions as the parameter to update design 

// Get all designs by UserId
export const getDesignsByUserId = async (userId) => {
    try {
        console.log(API_URL);
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching designs:', error);
        throw error;
    }
};

// Create a new design
export const createDesign = async (designData) => {
    try {
        const response = await axios.post(API_URL, designData);
        return response.data;
    } catch (error) {
        console.error('Error creating design:', error);
        throw error;
    }
};

// Delete a design by _id
export const deleteDesignById = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting design:', error);
        throw error;
    }
};

// Update a design by _id
export const updateDesignById = async (id, designData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, designData);
        return response.data;
    } catch (error) {
        console.error('Error updating design:', error);
        throw error;
    }
};

// Delete all designs by UserId
export const deleteDesignsByUserId = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting all designs for UserId:', error);
        throw error;
    }
};

// Delete all designs (for all users)
export const deleteAllDesigns = async () => {
    try {
        const response = await axios.delete(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error deleting all designs:', error);
        throw error;
    }
};