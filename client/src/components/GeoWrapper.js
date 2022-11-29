import React from "react";

const GeoWrapper = ({ geo, returnUserLike, returnPostLikes }) => {
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
          <p>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            This post was liked {returnPostLikes(`current-geo-post-id`)} amount
            of times
          </p>
          {/* <p>This post was liked: {counter.length} of times</p> */}
          {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
          {returnUserLike(`current-geo-post-id`)}
        </div>
      </div>
    </div>
  );
};

export default GeoWrapper;
