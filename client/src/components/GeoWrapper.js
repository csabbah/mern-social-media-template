import React, { useState, useEffect } from "react";
const GeoWrapper = ({
  returnUserLike,
  returnPostLikes,
  returnPostComments,
  data,
  commentData,
}) => {
  const [geoData, setGeoData] = useState(data);

  return (
    <div>
      <div className="geo-wrapper">
        <div className="geo-card">
          <p>Canada</p>
          <p>Image of flag</p>
          <p>Ottawa</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            <p className={"geo-post-0"} style={{ margin: "0" }}>
              {returnPostLikes(`current-geo-post-id`)}
            </p>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            {returnUserLike(`current-geo-post-id`, "geo-post-0")}
          </div>
          {/* //TODO: Add a comment section that has overflow-y scroll */}
          <div>{returnPostComments(`current-geo-post-id`, commentData)}</div>
        </div>
      </div>
    </div>
  );
};

export default GeoWrapper;
