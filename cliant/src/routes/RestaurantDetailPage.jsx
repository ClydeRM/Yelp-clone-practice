import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";
import RestaurantFinder from "../apis/RestaurantFinder";
import StartRating from "../components/StartRating";
import Reviews from "../components/Reviews";
import AddReview from "../components/AddReview";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { selectRestaurant, setSelectRestaurant } =
    useContext(RestaurantsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        // console.log(response);
        setSelectRestaurant(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {selectRestaurant && (
        <>
          <h1 className="text-center display-1">
            {selectRestaurant.restaurant.name}
          </h1>
          <div className="text-center">
            <StartRating rating={selectRestaurant.restaurant.average_rating} />
            <span className="text-warning ml-1">
              {selectRestaurant.restaurant.count
                ? `(${selectRestaurant.restaurant.count})`
                : "(0)"}
            </span>
          </div>
          <div className="mt-3">
            <Reviews reviews={selectRestaurant.reviews} />
          </div>
          <AddReview />
        </>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
