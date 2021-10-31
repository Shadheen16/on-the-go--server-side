const express = require('express');
const cors = require('cors');
const { MongoClient, MongoExpiredSessionError } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mango.qwtht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async () => {
    try{
        await client.connect();
        console.log("datebase connected successfully");

        const database = client.db("on-the-go");
        const serviceCollection = database.collection("services");

        //get all services api

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //post api
        app.post('/services', async (req, res) => {
            console.log('api hitted')
            const service = req.body;

            const result = await serviceCollection.insertOne(service);
            res.send(`A document was inserted with the _id: ${result.insertedId}`);
        })
    }
    finally {
        // client.close();
    }
};

run().catch(console.dir);


app.get('/',(req, res) => {
    res.send('node server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
})

