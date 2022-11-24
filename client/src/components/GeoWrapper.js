import React from "react";

const GeoWrapper = ({ geo }) => {
  console.log(geo);
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
        </div>
      </div>
    </div>
  );
};

export default GeoWrapper;
