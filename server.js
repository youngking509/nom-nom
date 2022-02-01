////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////

require("dotenv").config();

const { PORT = 4000, MONGODB_URL } = process.env;

const express = require("express");

const app = express();

const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

mongoose.connect(MONGODB_URL);

const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

////////////////////////////////////////////////////////////
// MODELS
////////////////////////////////////////////////////////////

const UserSchema = new mongoose.Schema({
    name: String,
    title: String,
    image: String,
    readyInMinutes: String,
    instructions: String
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

////////////////////////////////////////////////////////////
// MiddleWare
////////////////////////////////////////////////////////////
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////
// test route
app.get("/", (req, res) => {
    res.send("hello world");
});

// INDEX
app.get('/recipes', async (req, res) => {
    try {
        res.json(await User.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// UPDATE
app.put('/recipes/:id', async (req, res) => {
    try {
        res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    } catch (error) {
        res.status(400).json(error);
    }
});

// CREATE
app.post('/recipes', async (req, res) => {
    try {
        res.json(await User.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// DELETE
app.delete('/recipes/:id', async (req, res) => {
    try {
        res.json(await User.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

///////////////////////////////////////////////////////////////
// LISTENER
///////////////////////////////////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));