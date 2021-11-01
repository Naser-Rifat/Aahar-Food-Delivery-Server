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

console.log(uri);



async function run() {

    try {
        await client.connect();
        console.log('conected');

        const database = await client.db('Food-Service');
        const itemscollection = await database.collection('items');
        const orderscollection = await database.collection('orders')
        const foodblogscollection = await database.collection('food-blogs')
        const getservicecollection = await database.collection('getservice')
        console.log("ok");



        //Insert orders
        app.post('/items', async (req, res) => {
            const items = req.body;
            console.log(items);
            const doc = {
                email: req.body.email,
                username: req.body.username,
                itemname: req.body.itemname,
                price: req.body.price,
                description: req.body.description,
                img: req.body.img,
            }
            const result = await itemscollection.insertOne(doc)
            console.log(result);
            res.json(result)
        })


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
            console.log(req);
            const orders = req.body;
            console.log("All orders", orders);
            const doc = {
                email: req.body.email,
                username: req.body.username,
                itemname: req.body.itemname,
                img: req.body.img,
                description: req.body.description,
                status: req.body.status,
                address: req.body.address,
                price: req.body.price
            }
            const result = await orderscollection.insertOne(doc);
            console.log("inserted", result);
            res.json(result);

        })

        //fetch food-blog
        app.get('/foodblogs', async (req, res) => {
            const foodblogs = await foodblogscollection.find({})
            const item = await foodblogs.toArray({});
            res.json(item);
        })


        // fetch orders
        app.get('/orders', async (req, res) => {
            const orders = await orderscollection.find({})
            const item = await orders.toArray({});
            res.json(item);
        })
        // fetch how it works
        app.get('/getservice', async (req, res) => {
            const getservice = await getservicecollection.find({})
            const result = await getservice.toArray({});
            res.json(result);
        })

        //deletes orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const order = await orderscollection.deleteOne(query);
            console.log(order);
            res.json(order)
        })

        //Upadate
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id
            console.log("working", id);
            const filter = { _id: ObjectId(id) };
            const updated = {
                $set: {
                    email: req.body.email,
                    username: req.body.username,
                    itemname: req.body.itemname,
                    img: req.body.img,
                    description: req.body.description,
                    status: req.body.status,
                    price: req.body.price,
                    address: req.body.address

                }
            }
            const result = await orderscollection.updateOne(filter, updated);
            console.log(result);
            res.json(result);


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

