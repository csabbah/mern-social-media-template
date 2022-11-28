import React from "react";

const FactWrapper = ({
  facts,
  loggedIn,
  userDetail,
  handleLike,
  postLikes,
  postLoading,
  userLoading,
}) => {
  return (
    <div>
      {facts.length > 1 && !postLoading ? (
        <div className="facts-wrapper">
          {facts.map((fact, i) => {
            return (
              <div className="facts-card" key={i}>
                <p>{fact.topic}</p>
                <p>{fact.description}</p>
                {postLikes.map((like) => {
                  // CHeck if the post has LIKES in general (not just from the logged in user)
                  // TODO: Need to update this section - Future, should be fact._id
                  if (like.postId == `current-fact-post-id`) {
                    return <p>This post was liked</p>;
                  }
                })}
                {loggedIn && !userLoading ? (
                  <button
                    // Check if the USER liked the post
                    className={userDetail.user.likedArr
                      .map((like) => {
                        // TODO: Need to update this section - Future, should be fact._id
                        if (like.postId == `current-fact-post-id`) {
                          return `Checked`;
                        }
                      })
                      // .join removes the comma that is added after/before 'Checked'
                      .join("")}
                    onClick={(e) => {
                      e.stopPropagation();
                      /* // TODO: Need to update this section - Would need to pass the real Object ID*/
                      handleLike("current-fact-post-id", e.target.className);
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

export default FactWrapper;
