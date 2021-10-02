const express = require("express");
const cors = require("cors");
const db = require("./db");
const dotenv = require("dotenv");
const morgan = require('morgan');

// Create app
const app = express();

// Load .env 
dotenv.config({ path: "config.env" });

// Logger request
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// @desc Get all restaurants data
// @route GET /api/v1/restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM restaurants");
        // console.log(results);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurants: results.rows
            }
        });
    } catch (err) {
        console.error(err);
    }
});

// @desc Get one restaurant data
// @route GET /api/v1/restaurants/:id
app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {
        // console.log(req.params);
        // Not suggestions
        // // const id = req.params.id;
        // // const result = await db.query(`SELECT * FROM restaurants WHERE id=${id};`);
        // PG official suggestion
        const result = await db.query("SELECT * FROM restaurants WHERE id = $1", [req.params.id]);
        // console.log(result);
        res.status(200).json({
            status: "success",
            data: {
                restaurant: result.rows[0]
            }
        });
    } catch (err) {
        console.error(err);
    }
});

// @desc Create a restaurant
// @route POST /api/v1/restaurants/
app.post("/api/v1/restaurants", async (req, res) => {
    try {
        // console.log(req.body);
        const name = req.body.name;
        const location = req.body.location;
        const price_range = req.body.price_range;
        const results = await db.query(
            "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING *",
            [name, location, price_range]
        );
        console.log(results);
        res.status(201).json({
            status: "success",
            data: {
                restaurants: results.rows[0],
            }
        });
    } catch (err) {
        console.error(err);
    }
});

// @desc Update a restaurant
// @route PUT /api/v1/restaurants/:id
app.put("/api/v1/restaurants/:id", async (req, res) => {
    try {
        // console.log(req.params.id);
        // console.log(req.body);
        const results = await db.query(
            "UPDATE restaurants SET name=$1, location=$2, price_range=$3 WHERE id=$4 RETURNING *",
            [req.body.name, req.body.location, req.body.price_range, req.params.id]
        );
        // console.log(results);
        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            }
        });
    } catch (err) {
        console.error(err);
    }
});

// @desc Delete a restaurant
// @route DELETE /api/v1/restaurants/:id
app.delete("/api/v1/restaurants/:id",async (req, res) => {
    try {
        // console.log(req.params.id);
        const results = await db.query(
            "DELETE FROM restaurants WHERE id=$1 RETURNING *",
            [req.params.id]
        );
        // console.log(results);
        res.status(204).json({
            status: "success",
        });
    } catch (err) {
        console.error(err);
    }
    
});

// Listening PORT
const PORT = process.env.PORT || 3001;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`)
);
