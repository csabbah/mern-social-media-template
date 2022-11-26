import React from "react";

import { useQuery } from "@apollo/client";
import { GET_LIKES } from "../utils/queries";

const GeoWrapper = ({ geo, loggedIn, accountDetail, addNewLike }) => {
  const { loading, data } = useQuery(GET_LIKES);

  return (
    <div>
      {/* {geo.length > 1 ? (
        <div className="geo-wrapper">
          {geo.map((quote, i) => {
            return (
              <div className="geo-card" key={i}>
                <p>
                  {quote.author} / {quote.category}
                </p>
                <p>{quote.text}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )} */}
      <div className="geo-wrapper">
        <div className="geo-card">
          <p>Canada</p>
          <p>Image of flag</p>
          <p>Ottawa</p>
          {!loading &&
            data.likes.map((like) => {
              // TODO: Need to update this section
              if (like.postId == `Geo1222`) {
                return <p>This post was liked</p>;
              }
            })}
          {/* For reference - addNewLike(PostIdGoesHere) */}
          {/* // TODO: Need to update this section */}
          <button onClick={() => addNewLike("Geo1222")}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default GeoWrapper;
