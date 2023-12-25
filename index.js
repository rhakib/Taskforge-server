const express = require('express')
const app = express()
const cors = require('cors')
// const jwt = require('jsonwebtoken')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


//middleware

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.opj08k2.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const taskCollection = client.db('taskForge').collection('tasks')
    const ongoingCollection = client.db('taskForge').collection('ongoing')

    app.post('/tasks', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task)
      res.send(result)
    })

    app.get('/tasks', async (req, res) => {
      const result = await taskCollection.find().toArray()
      res.send(result)
    })

    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          ongoing: true,
          task: false
        }
      }
      const result = await taskCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    app.patch('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          complete: true,
          ongoing: false
        }
      }
      const result = await taskCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })









  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello TaskForge!')
})

app.listen(port, () => {
  console.log(`TaskForge running on ${port}`)
})