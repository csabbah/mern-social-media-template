import React from "react";

const GeoWrapper = ({
  geo,
  loggedIn,
  userDetail,
  handleLike,
  postLikes,
  userLoading,
  postLoading,
}) => {
  return (
    <div>
      {/* {geo.length > 1 ? (
        <div className="geo-wrapper">
          {geo.map((quote, i) => {
            return (
              <div className="geo-card" key={i}>
                <p>
                  {quote.author} / {quote.category}
                </p>
                <p>{quote.text}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )} */}
      <div className="geo-wrapper">
        {!postLoading && (
          <div className="geo-card">
            <p>Canada</p>
            <p>Image of flag</p>
            <p>Ottawa</p>
            {postLikes.map((like) => {
              // CHeck if the post has LIKES in general (not just from the logged in user)
              // TODO: Need to update this section - Future, should be fact._id
              if (like.postId == `current-geo-post-id`) {
                return <p>This post was liked</p>;
              }
            })}
            {loggedIn && !userLoading ? (
              <button
                // Check if the USER liked the post
                className={userDetail.user.likedArr
                  .map((like) => {
                    // TODO: Need to update this section - Future, should be geo._id
                    if (like.postId == `current-geo-post-id`) {
                      return `Checked`;
                    }
                  })
                  // .join removes the comma that is added after/before 'Checked'
                  .join("")}
                onClick={(e) => {
                  e.stopPropagation();

                  /* // TODO: Need to update this section - Would need to pass the real Object ID*/
                  handleLike("current-geo-post-id", e.target.className);
                }}
              >
                Like
              </button>
            ) : (
              <p>Login to like</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoWrapper;
