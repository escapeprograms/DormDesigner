### Database information

This is some information about connecting to MongoDB Atlas, our database solution. 
To run the system while connected to the database:
- Run 'npm install mongodb'
The following piece of code in 'index.js' connects the project to MongoDB.

 ```await mongoose.connect(process.env.MONGO_URL);
      console.log("Connected to DB");```
