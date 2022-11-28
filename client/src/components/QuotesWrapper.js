import React from "react";

const QuotesWrapper = ({
  quotes,
  loggedIn,
  accountDetail,
  addNewLike,
  likes,
}) => {
  const handleLike = (currentPostId) => {
    // Before adding a like, check to see if likes exist
    if (likes.length > 0) {
      likes.forEach((like) => {
        // Then check to see if the specific post is already liked by the user
        if (
          like.postId == currentPostId &&
          like.userId._id == accountDetail._id
        ) {
          return addNewLike(currentPostId, like._id, true);
        }
      });
      // If after above map method, it doesn't return true, then that means the
      // like is new, so post (add) the like
      addNewLike(currentPostId, null);
    } else {
      // If no likes exist at all, then execute function normally
      addNewLike(currentPostId, null);
    }
  };

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
                {likes.map((like) => {
                  // TODO: Need to update this section - Future, should be quote._id
                  if (like.postId == `current-quote-post-id`) {
                    return <p>This post was liked!</p>;
                  }
                })}
                {/* // TODO: Need to update this section - Would need to pass the real Object ID*/}
                {loggedIn ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      /* // TODO: Need to update this section - Would need to pass the real Object ID*/
                      handleLike("current-quote-post-id");
                    }}
                  >
                    Like
                  </button>
                ) : (
                  <p>Login to like</p>
                )}
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
