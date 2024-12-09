/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect */
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import {
  getDesignsByUserId,
  getDesignById,
  createDesign,
  deleteDesignById,
  updateDesignById,
  deleteDesignsByUserId,
  deleteAllDesigns,
} from './designServices.js';

describe('Design Services API Functions', () => {
  const API_URL = 'http://localhost:5000/api/design';
  const userId = 'user123';
  const designId = 'design123';
  const designData = { name: 'New Design', items: [] };
  let sandbox;

  beforeEach(() => {
    // Create a sandbox before each test
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    // Restore the sandbox after each test
    sandbox.restore();
  });

  // Get all designs by UserId
  it('should fetch designs by userId', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Design1' }] };
    sandbox.stub(axios, 'get').resolves(mockResponse);

    const result = await getDesignsByUserId(userId);
    expect(result).to.deep.equal(mockResponse.data);
    expect(axios.get.calledWith(`${API_URL}/${userId}`)).to.be.true;
  });

  // Get design by Id
  it('should fetch a design by id', async () => {
    const mockResponse = { data: { id: designId, name: 'Design1' } };
    sandbox.stub(axios, 'get').resolves(mockResponse);

    const result = await getDesignById(designId);
    expect(result).to.deep.equal(mockResponse.data);
    expect(axios.get.calledWith(`${API_URL}/user/${designId}`)).to.be.true;
  });

  // Create a new design
  it('should create a new design', async () => {
    const mockResponse = { data: { id: designId, ...designData } };
    sandbox.stub(axios, 'post').resolves(mockResponse);

    const result = await createDesign(designData);
    expect(result).to.deep.equal(mockResponse.data);
    expect(axios.post.calledWith(API_URL, designData)).to.be.true;
  });

  // Delete a design by id
  it('should delete a design by id', async () => {
    const mockResponse = { data: { message: 'Design deleted' } };
    sandbox.stub(axios, 'delete').resolves(mockResponse);

    const result = await deleteDesignById(designId);
    expect(result).to.deep.equal(mockResponse.data);
    expect(axios.delete.calledWith(`${API_URL}/${designId}`)).to.be.true;
  });

  // Update a design by id
  it('should update a design by id', async () => {
    const updatedDesignData = { name: 'Updated Design' };
    const mockResponse = { data: { id: designId, ...updatedDesignData } };
    sandbox.stub(axios, 'put').resolves(mockResponse);

    const result = await updateDesignById(designId, updatedDesignData);
    expect(result).to.deep.equal(mockResponse.data);
    expect(axios.put.calledWith(`${API_URL}/${designId}`, updatedDesignData)).to.be.true;
  });

  // Delete all designs by UserId
  it('should delete all designs by userId', async () => {
    const mockResponse = { data: { message: 'All designs deleted for user' } };
    sandbox.stub(axios, 'delete').resolves(mockResponse);

    const result = await deleteDesignsByUserId(userId);
    expect(result).to.deep.equal(mockResponse.data);
    expect(axios.delete.calledWith(`${API_URL}/user/${userId}`)).to.be.true;
  });

  // Delete all designs (for all users)
  it('should delete all designs for all users', async () => {
    const mockResponse = { data: { message: 'All designs deleted' } };
    sandbox.stub(axios, 'delete').resolves(mockResponse);

    const result = await deleteAllDesigns();
    expect(result).to.deep.equal(mockResponse.data);
    expect(axios.delete.calledWith(API_URL)).to.be.true;
  });
});
