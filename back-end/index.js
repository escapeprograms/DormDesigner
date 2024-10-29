import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';  
import path from 'path';
import { fileURLToPath } from 'url';

// database connection -------

const uri = 'mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

// ----------------------------------------------------
// setting up Express server to handle API requests from the frontend ----------------------------
const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dorm-designer/build')));


app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dorm-designer/build', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// -----------------------------------------------

