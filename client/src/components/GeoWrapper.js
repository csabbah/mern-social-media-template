import React, { useState, useEffect } from "react";
const GeoWrapper = ({
  returnPostInteractions,
  returnPostComments,
  data,
  commentData,
}) => {
  const [geoData, setGeoData] = useState(data);

  return (
    <div>
      <div className="geo-wrapper">
        <div className="geo-card">
          <div className="content-section">
            <p>Canada</p>
            <p>Image of flag 🇨🇦</p>
            <p>Ottawa</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            {returnPostInteractions(`current-geo-post-id`, "geo-post-0")}
          </div>
          {/* //TODO: Add a comment section that has overflow-y scroll */}
          {returnPostComments(`current-geo-post-id`, commentData)}
        </div>
      </div>
    </div>
  );
};

export default GeoWrapper;
