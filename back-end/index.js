import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config()
// const uri = process.env.MONGO_URL; 

const uri = "mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/dormDesigner?retryWrites=true&w=majority"

async function startServer() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const layoutController = (await import('./controllers/layoutController.js')).default;
    const designController = (await import('./controllers/designController.js')).default;
    const itemController = (await import('./controllers/itemController.js')).default;
    const defaultItemController = (await import('./controllers/defaultItemController.js')).default;

    
    const app = express();
    app.use(express.json()); 
    app.use(cors());
    const PORT = process.env.PORT || 5000;

    app.use('/api/layout', layoutController);
    app.use('/api/items', itemController);
    app.use('/api/design', designController);
    app.use('/api/defitems', defaultItemController);
    app.use(express.static(path.join(__dirname, '../dorm-designer/build')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dorm-designer/build', 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
