import axios from 'axios';

// const API_URL = 'https://dormdesignerws.onrender.com/api/design';

const API_URL_base = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = API_URL_base + "/design";


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

export const getDesignById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching design:', error);
        throw error;
    }
};

// Create a new design
export const createDesign = async (designData) => {
    try {
        console.log(designData, "post data")
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