import mongoose from 'mongoose';
import Design from 'back-end/models/designModel.js'
import Item from 'back-end/models/itemModel.js'
import Layout from 'back-end/models/layoutModel.js'
import DefaultItem from './models/defaultItemModel';


const uri = "mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/dormDesigner?retryWrites=true&w=majority"

const connectDB = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Functions to add entries
const addDesigns = async (designs) => {
  try {
    const result = await Design.insertMany(designs);
    console.log(`${result.length} designs added successfully`);
  } catch (error) {
    console.error('Error adding designs:', error.message);
  }
};

const addDefaultItems = async (items) => {
  try {
    const result = await DefaultItem.insertMany(items);
    console.log(`${result.length} default items added successfully`);
  } catch (error) {
    console.error('Error adding default items:', error.message);
  }
};

const addItems = async (items) => {
  try {
    const result = await Item.insertMany(items);
    console.log(`${result.length} items added successfully`);
  } catch (error) {
    console.error('Error adding items:', error.message);
  }
};

const addLayouts = async (layouts) => {
  try {
    const result = await Layout.insertMany(layouts);
    console.log(`${result.length} layouts added successfully`);
  } catch (error) {
    console.error('Error adding layouts:', error.message);
  }
};



const run = async () => { // edit this to add/remove data by calling the functions written above
  await connectDB();

  mongoose.connection.close();
};

run();