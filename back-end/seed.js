//RAN THIS FILE ALREADY, DOESN"T NEED TO BE RUN

import mongoose from 'mongoose';
import LayoutManager from './managers/layoutManager.js';

const layoutManager = new LayoutManager();

const MONGO_URI = 'mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/dormDesigner?retryWrites=true&w=majority';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding.");

    await layoutManager.deleteAllLayouts();
    console.log("Existing layouts cleared.");

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
      console.log(`Inserted layout with ID: ${createdLayout._id}`);
    }

    const allLayouts = await layoutManager.getAllLayouts();
    console.log("All seeded layouts:", JSON.stringify(allLayouts, null, 2)); 

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB after seeding.");
  }
}

seedDatabase().catch(console.error);
