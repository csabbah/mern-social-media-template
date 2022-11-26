import React from "react";

import { useQuery } from "@apollo/client";
import { GET_LIKES } from "../utils/queries";

const FactWrapper = ({ facts, loggedIn, accountDetail, addNewLike }) => {
  const { loading, data } = useQuery(GET_LIKES);

  return (
    <div>
      {facts.length > 1 ? (
        <div className="facts-wrapper">
          {facts.map((fact, i) => {
            return (
              <div className="facts-card" key={i}>
                <p>{fact.topic}</p>
                <p>{fact.description}</p>
                {!loading &&
                  data.likes.map((like) => {
                    // TODO: Need to update this section - Future, should be fact._id
                    if (like.postId == `fact#-${i}`) {
                      return <p>This post was liked</p>;
                    }
                  })}
                {/* For reference - addNewLike(PostIdGoesHere) */}
                {/* // TODO: Need to update this section - Would need to pass the real Object ID*/}
                <button onClick={() => addNewLike(`fact#-${i}`)}>Save</button>
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
