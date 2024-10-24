
//'mongodb+srv://ananyakoduru22:<Sj3Qgq4JcLUnPAgH>@cluster0.uvjkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
import { MongoClient, ServerApiVersion } from 'mongodb';  // Use import for MongoDB

const uri = 'mongodb+srv://ananyakoduru22:wJJdnMfiXTaPEyFs@cluster0.pjmeg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Ensure you're loading the URI from environment variables

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);