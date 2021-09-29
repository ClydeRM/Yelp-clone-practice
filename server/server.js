const express = require('express');
const dotenv = require('dotenv');

// Load .env 
dotenv.config({path: "./.env"});

const app = express();

// Listening PORT
const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`)
);
