const express = require('express');
const cors = require("cors");

const { MongoClient } = require('mongodb');

require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ObjectId = require("mongodb").ObjectId;


// Mongodb URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0xoz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {

    try {
        await client.connect();
        console.log('conected');

        const database = await client.db('Food-Service');
        const itemscollection = await database.collection('items');
        const orderscollection = await database.collection('orders')
        console.log("ok");


        // Find data from database
        app.get('/items', async (req, res) => {
            const fooditem = await itemscollection.find({});
            const item = await fooditem.toArray();
            console.log(item);
            res.json(item);
        })
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemscollection.findOne(query);
            console.log(item);
            res.json(item);
        })


        // order post 
        app.post('/orders', async (req, res) => {

            const orders = req.body;
            console.log(orders);
            const doc = {
                _id: ObjectId(req.body._id),
                name: req.body.name,
                img: req.body.img,
                description: req.body.description
            }
            const result = await orderscollection.insertOne(doc);
            console.log("inserted", result);
            res.json(result);

        })

        // fetch orders
        app.get('/orders', async (req, res) => {
            const orders = await orderscollection.find({})
            const item = await orders.toArray({});
            res.json(item);
        })

        //delets orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const order = await orderscollection.deleteOne(query);
            console.log(order);
            res.json(order)
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send("server run");
})

app.listen(port, (req, res) => {
    console.log("hitted server", port)
})

