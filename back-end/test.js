//RAN THIS FILE ALREADY, DOESN"T NEED TO BE RUN

import mongoose from 'mongoose';
import LayoutManager from './managers/layoutManager.js';

const layoutManager = new LayoutManager();

const MONGO_URI = 'mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/dormDesigner?retryWrites=true&w=majority';

async function testDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for CRUD test.");
    var createdId = null;

    const seedData = [
      { vertices : [
        [-3,-2.5],
        [0,-2.5],
        [0,-1.5],
        [2,-1.5],
        [2,-2.5],
        [3,-2.5],
        [,1.5],
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
        [-3,-2.5] ] }
    ];

    for (const layout of seedData) {
      const createdLayout = await layoutManager.createLayout(layout);
      createdId = createdLayout._id;
      console.log(`Inserted layout with ID: ${createdLayout._id}`);
    }

    const pullLayout = await layoutManager.getLayoutById(createdId);
    console.log("Retrieved layout:", JSON.stringify(pullLayout, null, 2)); 

    const deleted2 = await layoutManager.deleteLayoutById(createdId);
    console.log("Layout deleted.")

  } catch (error) {
    console.error("Error testing database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB after testing.");
  }
}

testDatabase().catch(console.error);
