import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const uri = process.env.MONGO_URL; 

async function startServer() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const layoutController = (await import('./controllers/layoutController.js')).default;

    
    const app = express();
    app.use(express.json()); 
    const PORT = process.env.PORT || 3000;

    app.use('/api', layoutController);
    app.use(express.static(path.join(__dirname, '../dorm-designer/build')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dorm-designer/build', 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Register the layout controller under the /api route
app.use('/api', layoutController(client));

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDB(); 
});


