const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
require('dotenv').config();
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.disah5t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('friendsMart').collection('flashsale');
        const categoryCollection = client.db('friendsMart').collection('categories');
        const productsCollection = client.db('friendsMart').collection('products');
        const addCartCollection = client.db('friendsMart').collection('addCart');

        app.get('/flashsale', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id };
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
        app.post('/addcart', async (req, res) => {
            const product = req.body;
            // console.log(product);
            const result = await addCartCollection.insertOne(product);
            res.send(result);

        })
        app.get('/addcart', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = addCartCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    finally {

    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Friends mart node server running!');
})

app.listen(port, () => {
    console.log(`Friends mart node server running on port ${port}`);
})