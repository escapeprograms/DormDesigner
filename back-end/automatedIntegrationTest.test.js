import { beforeAll, afterAll, test, expect } from '@jest/globals';
import mongoose from 'mongoose';
import LayoutManager from './managers/layoutManager.js';
import ItemManager from './managers/itemManager.js';
import DesignManager from './managers/designManager.js';

const MONGO_URI = 'mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/dormDesigner?retryWrites=true&w=majority';


let layoutManager, itemManager, designManager;

beforeAll(async () => {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  layoutManager = new LayoutManager();
  itemManager = new ItemManager();
  designManager = new DesignManager();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('Should create and retrieve a layout', async () => {
  const layout = { id: 1, vertices: [[-3, -2.5], [0, -2.5]] };
  const createdLayout = await layoutManager.createLayout(layout);
  expect(createdLayout._id).toBeDefined();
  const retrievedLayout = await layoutManager.getLayoutById(createdLayout._id);
  expect(retrievedLayout.id).toBe(layout.id);
  await layoutManager.deleteLayoutById(createdLayout._id);
});

test('Should create, retrieve, and delete an item', async () => {
  const item = {
    id: '54a5732f-1eb7-449e-89d3-40db1be2d31d',
    type: 'floor',
    meshPath: 'abc',
    position: [0, 0, 0],
    rotation: 0,
    footprints: [
      { x: 0, y: 0 },
      { x: 37.75, y: 0 },
      { x: 37.75, y: 84.75 },
      { x: 0, y: 84.75 },
    ],
  };

  const createdItem = await itemManager.createItem(item);
  expect(createdItem.id).toBe(item.id);

  const retrievedItem = await itemManager.getItemById(createdItem.id);
  expect(retrievedItem.type).toBe(item.type);

  await itemManager.deleteItemById(createdItem.id);
  const deletedItem = await itemManager.getItemById(createdItem.id);
  expect(deletedItem).toBeNull(); // Assuming your getItemById returns null if not found
});

test('Should create, retrieve, and delete a design', async () => {
  const design = {
    userId: 1,
    vertices: [
      [-3, -2.5],
      [0, -2.5],
      [0, -1.5],
      [2, -1.5],
      [2, -2.5],
    ],
    furnitureIds: [],
  };

  const createdDesign = await designManager.createDesign(design);
  expect(createdDesign.userId).toBe(design.userId);

  const retrievedDesigns = await designManager.getDesignsByUserId(design.userId);
  expect(retrievedDesigns.length).toBeGreaterThan(0);
  expect(retrievedDesigns[0].userId).toBe(design.userId);

  await designManager.deleteDesignById(createdDesign._id);
  const deletedDesigns = await designManager.getDesignsByUserId(design.userId);
  expect(deletedDesigns).toEqual([]);
});
