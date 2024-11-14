import { strict as assert } from 'assert';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    getDesignsByUserId,
    getDesignById,
    createDesign,
    deleteDesignById,
    updateDesignById,
    deleteDesignsByUserId,
    deleteAllDesigns
} from './designServices.js'; 

const mock = new MockAdapter(axios);
// const API_URL = 'https://dormdesignerws.onrender.com/';
const API_URL_base = process.env.API_URL || 'http://localhost:5000/api';
const API_URL = API_URL_base + "/design";

describe('Design Services API Functions', function() {
    afterEach(() => {
        mock.reset(); 
    });

    it('should fetch designs by userId', async function() {
        const userId = '123';
        const mockData = [{ id: '1', name: 'Design 1' }, { id: '2', name: 'Design 2' }];

        mock.onGet(`${API_URL}/${userId}`).reply(200, mockData);

        const result = await getDesignsByUserId(userId);
        assert.deepEqual(result, mockData);
    });

    it('should fetch a design by id', async function() {
        const id = '1';
        const mockData = { id: '1', name: 'Design 1' };

        mock.onGet(`${API_URL}/user/${id}`).reply(200, mockData);

        const result = await getDesignById(id);
        assert.deepEqual(result, mockData);
    });

    it('should create a new design', async function() {
        const designData = { name: 'New Design' };
        const mockResponse = { id: '1', name: 'New Design' };

        mock.onPost(API_URL).reply(201, mockResponse);

        const result = await createDesign(designData);
        assert.deepEqual(result, mockResponse);
    });

    it('should delete a design by id', async function() {
        const id = '1';
        const mockResponse = { message: 'Design deleted successfully' };

        mock.onDelete(`${API_URL}/${id}`).reply(200, mockResponse);

        const result = await deleteDesignById(id);
        assert.deepEqual(result, mockResponse);
    });

    it('should update a design by id', async function() {
        const id = '1';
        const designData = { name: 'Updated Design' };
        const mockResponse = { id: '1', name: 'Updated Design' };

        mock.onPut(`${API_URL}/${id}`).reply(200, mockResponse);

        const result = await updateDesignById(id, designData);
        assert.deepEqual(result, mockResponse);
    });

    it('should delete all designs for a user by userId', async function() {
        const userId = '123';
        const mockResponse = { message: 'All designs for user deleted' };

        mock.onDelete(`${API_URL}/user/${userId}`).reply(200, mockResponse);

        const result = await deleteDesignsByUserId(userId);
        assert.deepEqual(result, mockResponse);
    });

    it('should delete all designs', async function() {
        const mockResponse = { message: 'All designs deleted' };

        mock.onDelete(API_URL).reply(200, mockResponse);

        const result = await deleteAllDesigns();
        assert.deepEqual(result, mockResponse);
    });
});