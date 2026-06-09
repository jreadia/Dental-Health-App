// app.js
// sample only

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
    const { name } = req.body;
    res.send(`Welcome ${name ? name : 'Guest'}`);
});

module.exports = app;
