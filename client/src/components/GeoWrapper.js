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
          <div className="content-section">
            <p>Canada</p>
            <p>Image of flag 🇨🇦</p>
            <p>Ottawa</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            <p className={"geo-post-0"} style={{ margin: "0" }}>
              {returnPostLikes(`current-geo-post-id`)}
            </p>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            {returnUserLike(`current-geo-post-id`, "geo-post-0")}
          </div>
          {/* //TODO: Add a comment section that has overflow-y scroll */}
          {returnPostComments(`current-geo-post-id`, commentData)}
        </div>
        {/* ------------------------------------------------------------- // * EXAMPLE OF A SECOND POST */}
        <div className="geo-card">
          <div className="content-section">
            <p>Eswatini</p>
            <p>Image of flag 🇸🇿</p>
            <p>Mbabane</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            <p className={"geo-post-1"} style={{ margin: "0" }}>
              {returnPostLikes(`current-geo-post-id2`)}
            </p>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            {returnUserLike(`current-geo-post-id2`, "geo-post-1")}
          </div>
          {/* //TODO: Add a comment section that has overflow-y scroll */}
          {returnPostComments(`current-geo-post-id2`, commentData)}
        </div>
        {/* ------------------------------------------------------------- // * EXAMPLE OF A THIRD POST */}
        <div className="geo-card">
          <div className="content-section">
            <p>Portugal</p>
            <p>Image of flag 🇵🇹</p>
            <p>Lisbon</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            <p className={"geo-post-2"} style={{ margin: "0" }}>
              {returnPostLikes(`current-geo-post-id3`)}
            </p>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            {returnUserLike(`current-geo-post-id3`, "geo-post-1")}
          </div>
          {/* //TODO: Add a comment section that has overflow-y scroll */}
          {returnPostComments(`current-geo-post-id3`, commentData)}
        </div>
      </div>
    </div>
  );
};

export default GeoWrapper;
