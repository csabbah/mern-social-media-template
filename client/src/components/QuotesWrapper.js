import React from "react";

import { useQuery } from "@apollo/client";
import { GET_LIKES } from "../utils/queries";

const QuotesWrapper = ({ quotes, loggedIn, accountDetail, addNewLike }) => {
  const { loading, data } = useQuery(GET_LIKES);

  return (
    <div>
      {quotes.length > 1 ? (
        <div className="quotes-wrapper">
          {quotes.map((quote, i) => {
            return (
              <div className="quotes-card" key={i}>
                <p>
                  {quote.author} / {quote.category}
                </p>
                <p>{quote.text}</p>
                {!loading &&
                  data.likes.map((like) => {
                    // TODO: Need to update this section - Future, should be quote._id
                    if (like.postId == `quotes#-${i}`) {
                      return <p>This post was liked</p>;
                    }
                  })}
                {/* For reference - addNewLike(PostIdGoesHere) */}
                {/* // TODO: Need to update this section - Would need to pass the real Object ID*/}
                <button onClick={() => addNewLike(`quotes#-${i}`)}>Save</button>
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

export default QuotesWrapper;
