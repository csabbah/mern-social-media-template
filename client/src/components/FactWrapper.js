import React from "react";
import { AiOutlineSave } from "react-icons/ai";
const FactWrapper = ({
  facts,
  returnUserLike,
  returnPostLikes,
  returnPostComments,
}) => {
  return (
    <div>
      {/* // TODO: Use this for the final one */}
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
                  <AiOutlineSave />
                  <div>{returnPostComments(`current-fact-post-id`)}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="facts-wrapper">
        <div className="facts-card">
          <p>{facts.topic}</p>
          <p>{facts.description}</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p className={`fact-post-0`} style={{ margin: "0" }}>
              {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
              {returnPostLikes(`current-fact-post-id`)}
            </p>
            {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
            {returnUserLike(`current-fact-post-id`, `fact-post-0`)}
            <AiOutlineSave />
            <div>{returnPostComments(`current-fact-post-id`)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactWrapper;
