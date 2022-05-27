const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middle ware
app.use(cors());
app.use(express.json());

// mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txdws.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const reviewCollection = client.db('af_electronic_ltd').collection('reviews');
    const productCollection = client.db('af_electronic_ltd').collection('products');
    const orderCollection = client.db('af_electronic_ltd').collection('order');
    const userCollection = client.db('af_electronic_ltd').collection('users');

    /*     // auth 
        app.post('/login', async(req, res) =>{
          const user = req.body;
          const accessToken =jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
          });
          res.send({ accessToken });
        }) */

    // get review  api
    app.get('/review', async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    })

    // post review api
    app.post('/review', async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    })

    // get product api
    app.get('/product', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // get porduct purchase api
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    })

    // post product api
    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    // order post api
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })

    // order get api
    app.get('/order', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray()
      res.send(orders);
    });

    app.put('/user/:email', async(req, res) =>{
      const email = req.params.email;
      const user = req.body;
      const filter = {email: email};
      const options = {upsert: true};
      const updateDoc ={
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
      res.send({result, token});
    })


    // make admin user api
/*     app.get('/user', async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    }) */

  }
  finally {

  }

}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello from af electronic ltd.')
})

app.listen(port, () => {
  console.log(`Af electronic ltd app listening on port ${port}`)
})