import { MongoClient, ServerApiVersion } from 'mongodb';
import layoutController from './controllers/layoutController.js';
import express from 'express';

const uri = 'mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Express App Setup
const app = express();
app.use(express.json()); // Middleware for JSON requests
const PORT = 5000;

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Register the layout controller under the /api route
app.use('/api', layoutController);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDB(); 
});


