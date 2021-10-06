import React, { useState, createContext } from "react";

export const RestaurantsContext = createContext();

export const RestaurantsContextProvider = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const addRestaurants = (restaurant) => {
    // auto add new data in context array to render new data
    setRestaurants([...restaurants, restaurant]);
  };
  const [selectRestaurant, setSelectRestaurant] = useState(null);

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        setRestaurants,
        addRestaurants,
        selectRestaurant,
        setSelectRestaurant,
      }}
    >
      {props.children}
    </RestaurantsContext.Provider>
  );
};
