import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";
import RestaurantFinder from "../apis/RestaurantFinder";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { selectRestaurant, setSelectRestaurant } =
    useContext(RestaurantsContext);

  useEffect(() => {
    const getRestaurant = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        // console.log(response);
        setSelectRestaurant(response.data.data.restaurant);
      } catch (error) {
        console.error(error);
      }
    };
    getRestaurant();
  }, []);

  return <div>{selectRestaurant && selectRestaurant.name }</div>;
};

export default RestaurantDetailPage;
