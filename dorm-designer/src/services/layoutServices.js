import axios from 'axios';

// const API_URL = 'http://localhost:5000/api'; // For now this is for when running backend on local machine (route setup on index.js), will need to change this when actually hosting server

// const API_URL =  'https://dormdesignerws.onrender.com/api/design';

const API_URL_base = process.env.API_URL || 'http://localhost:5000/api';

const API_URL = API_URL_base + "/layout";



// Retrieve layout by ID
export const getLayoutById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Create a new layout
export const createLayout = async (layoutData) => {
    const response = await axios.post(API_URL, layoutData);
    return response.data;
};

// Delete a layout by ID
export const deleteLayoutById = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const updateLayoutById = async (id, layoutData) => {
    const response = await axios.put(`${API_URL}/${id}`, layoutData);
    return response.data;
};