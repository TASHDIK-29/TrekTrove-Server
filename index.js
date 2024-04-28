const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://trektrove-a10.web.app'],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iepmiic.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // Connect the client to the server	(optional starting in v4.7)


        const database = client.db("TouristSpotDB");
        const touristSpotCollections = database.collection("touristSpots");
        const countryCollection = database.collection("country");

        app.get('/spots', async (req, res) => {
            const cursor = touristSpotCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/spots', async (req, res) => {
            const spot = req.body;
            const result = await touristSpotCollections.insertOne(spot);
            res.send(result);
        })

        app.get('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotCollections.findOne(query);
            res.send(result);
        })


        app.get('/myAdds/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = touristSpotCollections.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristSpotCollections.deleteOne(query);
            res.send(result);
        })


        app.put('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedSpot = req.body;

            const spot = {
                $set: {
                    avgCost : updatedSpot.avgCost ,
                    intAvgCost : updatedSpot.intAvgCost ,
                    counter : updatedSpot.counter ,
                    description : updatedSpot.description ,
                    // email : updatedSpot.email ,
                    location : updatedSpot.location ,
                    photo : updatedSpot.photo ,
                    seasonality : updatedSpot.seasonality ,
                    spotName : updatedSpot.spotName ,
                    travelTime : updatedSpot.travelTime ,
                    // userName : updatedSpot.userName ,
                    visitorsPerYear : updatedSpot.visitorsPerYear
                       
                }
            }

            const result = await touristSpotCollections.updateOne(query, spot);
            res.send(result);

        })


        // Country
        app.get('/country', async(req, res) =>{
            const cursor = countryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/countries/:country', async (req, res) => {
            const country = req.params.country;
            const query = { counter: country };
            const cursor = touristSpotCollections.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // sort
        app.get('/sort', async (req, res) => {
            const cursor = touristSpotCollections.find().sort({ intAvgCost : -1 });
            const result = await cursor.toArray();
            res.send(result);
        })





        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})