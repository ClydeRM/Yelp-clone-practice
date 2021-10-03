import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import RestaurantFinder from "../apis/RestaurantFinder";

const UpdateRestaurant = (props) => {
  const { id } = useParams();
  //   console.log(id);
  let history = useHistory();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("Price Range");

  useEffect(() => {
    const getRestaurant = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        // console.log(response.data.data);
        setName(response.data.data.restaurant.name);
        setLocation(response.data.data.restaurant.location);
        setPriceRange(response.data.data.restaurant.price_range);
      } catch (error) {
        console.error(error);
      }
    };
    getRestaurant();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();// prevent to reload page
    const updateRestaurant = await RestaurantFinder.put(`/${id}`, {
        name: name,
        location: location,
        price_range: priceRange,
    });
    // console.log(updateRestaurant);
    history.push("/");
  }

  return (
    <div>
      <form action="">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-control"
            id="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            className="form-control"
            id="location"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price_range">Price Range</label>
          <input
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            type="number"
            className="form-control"
            id="price_range"
          />
        </div>
        <button type="submit" onClick={ handleSubmit } className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default UpdateRestaurant;
