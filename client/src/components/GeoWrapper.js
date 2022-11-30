import React from "react";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
const GeoWrapper = ({ geo, returnUserLike, returnPostLikes }) => {
  return (
    <div>
      <div className="geo-wrapper">
        <div className="geo-card">
          <p>Canada</p>
          <p>Image of flag</p>
          <p>Ottawa</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p className={"geo-post-0"} style={{ margin: "0" }}>
              {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
              {returnPostLikes(`current-geo-post-id`)}
            </p>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            {returnUserLike(`current-geo-post-id`, "geo-post-0")}
            <FaRegComment />
            <AiOutlineSave />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoWrapper;
