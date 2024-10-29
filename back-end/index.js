import express from 'express';
import mongoose from 'mongoose';

const uri = 'mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/dormDesigner?retryWrites=true&w=majority'; 

async function startServer() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");

    const layoutController = (await import('./controllers/layoutController.js')).default;

    const app = express();
    app.use(express.json()); 
    const PORT = 5000;

    app.use('/api', layoutController);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
