import React from "react";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
const FactWrapper = ({ facts, returnUserLike, returnPostLikes }) => {
  return (
    <div>
      {facts.length > 1 ? (
        <div className="facts-wrapper">
          {facts.map((fact, i) => {
            return (
              <div className="facts-card" key={i}>
                <p>{fact.topic}</p>
                <p>{fact.description}</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p className={`fact-post-${i}`} style={{ margin: "0" }}>
                    {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
                    {returnPostLikes(`current-fact-post-id`)}
                  </p>
                  {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
                  {returnUserLike(`current-fact-post-id`, `fact-post-${i}`)}
                  <FaRegComment />
                  <AiOutlineSave />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FactWrapper;
