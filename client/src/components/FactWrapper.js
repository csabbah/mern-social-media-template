import React from "react";

import { useMutation, useQuery } from "@apollo/client";
import { ADD_LIKE } from "../utils/mutations";
import { GET_LIKES } from "../utils/queries";

const FactWrapper = ({ facts, loggedIn, accountDetail }) => {
  const [addLike, { likeErr }] = useMutation(ADD_LIKE);
  const { loading, data } = useQuery(GET_LIKES);

  // TODO: Add function to not allow users to like a post again (check liked boolean)
  const addNewLike = async (id) => {
    try {
      await addLike({
        variables: {
          // TODO: Once you return data from DB, need to use the real object ID
          postId: `testId#${id}`,
          userId: accountDetail._id,
          liked: true,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };
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
                    // TODO: Need to update this section
                    if (like.postId == `testId#${i}`) {
                      return <p>This post was liked</p>;
                    }
                  })}
                <button onClick={() => addNewLike(i)}>Save</button>
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
