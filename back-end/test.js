//RAN THIS FILE ALREADY, DOESN"T NEED TO BE RUN

import mongoose from 'mongoose';
import LayoutManager from './managers/layoutManager.js';
import ItemManager from './managers/itemManager.js';
import DesignManager from './managers/designManager.js';

const layoutManager = new LayoutManager();
const itemManager = new ItemManager();
const designManager = new DesignManager();

const MONGO_URI = 'mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/dormDesigner?retryWrites=true&w=majority';

async function testDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for CRUD test.");
    var createdId = null;

    const seedData = [
      { id : 1,
        vertices : [
        [-3,-2.5],
        [0,-2.5],
        [0,-1.5],
        [2,-1.5],
        [2,-2.5],
        [3,-2.5],
        [3,1.5],
        [2,1.5],
        [2,2.5],
        [-2,2.5],
        [-2,1.5],
        [-3,1.5],
        [-3,1],
        [-4,1],
        [-4,0],
        [-3,0],
        [-3,-1],
        [-4,-1],
        [-4,-2],
        [-3,-2],
        [-3,-2.5] ], 
        defaultFurnitureIds : [] }
    ];

    const designObject = { userId : 1,
      vertices : [
      [-3,-2.5],
      [0,-2.5],
      [0,-1.5],
      [2,-1.5],
      [2,-2.5],
      [3,-2.5],
      [3,1.5],
      [2,1.5],
      [2,2.5],
      [-2,2.5],
      [-2,1.5],
      [-3,1.5],
      [-3,1],
      [-4,1],
      [-4,0],
      [-3,0],
      [-3,-1],
      [-4,-1],
      [-4,-2],
      [-3,-2],
      [-3,-2.5] ], 
      furnitureIds : [] }

    const itemObject = {
      id: "54a5732f-1eb7-449e-89d3-40db1be2d31d", 
      type: "floor", 
      meshPath: "abc",
      position: [0, 0, 0], 
      rotation: 0,
      footprints: [
        {x: 0, y: 0},
        {x: 37.75, y: 0},
        {x: 37.75, y: 84.75},
        {x: 0, y: 84.75}
      ]
    };

    for (const layout of seedData) {
      const createdLayout = await layoutManager.createLayout(layout);
      createdId = createdLayout._id;
      console.log(`Inserted layout with ID: ${createdLayout._id}`);
    }

    const createdItem = await itemManager.createItem(itemObject);
    let createdItemId = createdItem.id;
    console.log(`created item of ID: ${createdItemId}`)

    const createdDesign = await designManager.createDesign(designObject);
    let createdDesignUserId = createdDesign.userId;
    console.log(`created design of user ID: ${createdDesignUserId}`);
    console.log("created design:", JSON.stringify(createdDesign, null, 2));

    const pullLayout = await layoutManager.getLayoutById(createdId);
    console.log("Retrieved layout:", JSON.stringify(pullLayout, null, 2)); 

    const pullItem = await itemManager.getItemById(createdItemId);
    console.log("Retrieved item:", JSON.stringify(pullItem, null, 2)); 

    const pullDesignItems = await designManager.getDesignsByUserId(createdDesignUserId);
    console.log("Retrieved designs:", JSON.stringify(pullDesignItems, null, 2)); 

    const deleted2 = await layoutManager.deleteLayoutById(createdId);
    console.log("Layout deleted.")

    const deletedItem = await itemManager.deleteItemById(createdItemId);
    console.log("Item deleted.")

    const deletedDesign = await designManager.deleteDesignById(createdDesign._id);
    console.log("Design deleted.")

  } catch (error) {
    console.error("Error testing database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB after testing.");
  }
}

testDatabase().catch(console.error);
