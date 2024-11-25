import axios from 'axios';

// const API_URL = 'https://dormdesignerws.onrender.com/api/design';

const API_URL_base = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = API_URL_base + "/defitems"

//basically upon pulling a layout, the defaultFurnitureIds should be used to pull the furniture items, which are then copies as a normal furniture item, saved, id added to design
export const getDefaultItemById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

