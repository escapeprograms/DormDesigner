import { MongoClient, ServerApiVersion } from 'mongodb';
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

// Setting up API Route here
app.get('/api/layouts', async (req, res) => {
  try {
    const database = client.db('dormDesigner'); 
    const layouts = database.collection('layouts'); 
    const result = await layouts.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching layouts', error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDB(); 
});


