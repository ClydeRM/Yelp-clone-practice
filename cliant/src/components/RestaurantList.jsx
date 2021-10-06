import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";

const RestaurantList = (props) => {
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  let history = useHistory(); // for route to update Page
  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await RestaurantFinder.get("/");
        // console.log(response);
        setRestaurants(response.data.data.restaurants);
      } catch (error) {
        console.error(error);
      }
    };
    getRestaurants();
  }, []); // 3.25.00

  // 順序性 事件由小範圍傳至大範圍 stopPropagation() 可防止事件觸發當下範圍外的物件
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // for prevent click btn to alert router to do table route
    try {
      const response = await RestaurantFinder.delete(`/${id}`);
      // console.log(response);
      setRestaurants(
        restaurants.filter((restaurant) => {
          return restaurant.id !== id;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  // 順序性 事件由小範圍傳至大範圍 stopPropagation() 可防止事件觸發當下範圍外的物件
  const handleUpdate = async (e, id) => {
    e.stopPropagation(); // for prevent click btn to alert router to do table route
    history.push(`/restaurants/${id}/update`);
  };

  // 順序性 事件由小範圍傳至大範圍
  const handleRestaurantSelect = (id) => {
    history.push(`/restaurants/${id}`); // redirect to  detail page
  };

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
          {restaurants &&
            restaurants.map((restaurant) => {
              return (
                <tr
                  onClick={() => handleRestaurantSelect(restaurant.id)}
                  key={restaurant.id}
                >
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{"$".repeat(restaurant.price_range)}</td>
                  <td>review</td>
                  <td>
                    <button
                      onClick={(e) => handleUpdate(e, restaurant.id)}
                      className="btn btn-warning"
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={(e) => handleDelete(e, restaurant.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
        {/* <tbody>
          <tr>
            <td>mc</td>
            <td>mc</td>
            <td>mc</td>
            <td>mc</td>
            <td><button className="btn btn-warning">Update</button></td>
            <td><button className="btn btn-danger">Delete</button></td>
          </tr>
        </tbody> */}
      </table>
    </div>
  );
};

export default RestaurantList;
