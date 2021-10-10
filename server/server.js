const express = require("express");
const cors = require("cors");
const db = require("./db");
const dotenv = require("dotenv");
const morgan = require("morgan");

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
    const results = await db.query("SELECT * FROM restaurants ORDER BY id");
    // console.log(results);

    const restaurantRatingData = await db.query(
      "select * from restaurants left join (select restaurant_id, count(*), trunc(avg(rating), 2) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id order by id;"
    );

    console.log(restaurantRatingData);

    res.status(200).json({
      status: "success",
      results: restaurantRatingData.rows.length,
      data: {
        restaurants: restaurantRatingData.rows,
      },
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
    const restaurant = await db.query(
      "select * from restaurants left join (select restaurant_id, count(*), trunc(avg(rating), 2) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id=$1;",
      [req.params.id]
    );

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id = $1",
      [req.params.id]
    );

    // console.log(restaurant);
    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
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
      },
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
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
  }
});

// @desc Delete a restaurant
// @route DELETE /api/v1/restaurants/:id
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    // console.log(req.params.id);

    const reference = await db.query(
      `DELETE FROM reviews WHERE restaurant_id=$1 RETURNING *`,
      [req.params.id]
    );
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

// @desc Create a review
// @route POST /api/v1/restaurants/:id/addReview
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    // console.log(req.body);
    const restaurant_id = req.params.id;
    const name = req.body.name;
    const review = req.body.review;
    const rating = req.body.rating;

    const results = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) VALUES ($1, $2, $3, $4) RETURNING *",
      [restaurant_id, name, review, rating]
    );
    console.log(results);
    res.status(201).json({
      status: "success",
      data: {
        review: results.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
  }
});

// Listening PORT
const PORT = process.env.PORT || 3001;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  )
);
