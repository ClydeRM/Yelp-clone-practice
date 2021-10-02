import React, { useEffect } from 'react';
import RestaurantFinder from "../apis/RestaurantFinder";


const RestaurantList = () => {

    useEffect(() =>{
      const getRestaurants = async () => {
        try {
          const response = await RestaurantFinder.get("/");
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      }
      getRestaurants();
    },[]); // 3.25.00
    return (
      <div className="list-group">
        <table className="table table-dark table-hover">
          <thead>
            <tr className="bg-primary">
              <th scope="col">Restaurant</th>
              <th scope="col">Location</th>
              <th scope="col">Price Range</th>
              <th scope="col">Rating</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>mc</td>
              <td>mc</td>
              <td>mc</td>
              <td>mc</td>
              <td><button className="btn btn-warning">Update</button></td>
              <td><button className="btn btn-danger">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
}

export default RestaurantList;
