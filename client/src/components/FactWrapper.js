import React from "react";

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
                <p>
                  {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
                  This post was liked {returnPostLikes(`current-fact-post-id`)}{" "}
                  amount of times
                </p>
                {/* <p>This post was liked: {counter.length} of times</p> */}
                {/* // TODO: Need to update this section - Would need to pass the real post ID*/}
                {returnUserLike(`current-fact-post-id`)}
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
