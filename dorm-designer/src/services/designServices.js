import axios from 'axios';

// const API_URL = 'http://localhost:5000/api'; // For now this is for when running backend on local machine (route setup on index.js), will need to change this when actually hosting server
const API_URL = process.env.API_URL + '/design' || 'http://localhost:5000/api/design';


export const getDesignByUserId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createDesign = async (designData) => {
    const response = await axios.post(API_URL, designData);
    return response.data;
};

export const deleteDesignByUserId = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const updateDesignByUserId = async (id, designData) => {
    const response = await axios.put(`${API_URL}/${id}`, designData);
    return response.data;
};