import React, { useState, useEffect, useMemo, useDebugValue } from "react";

import VocabWrapper from "../components/VocabWrapper";
import FactWrapper from "../components/FactWrapper";
import QuotesWrapper from "../components/QuotesWrapper";
import GeoWrapper from "../components/GeoWrapper";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiSaveLine, RiSaveFill, RiCollageFill } from "react-icons/ri";
import Auth from "../utils/auth";

import { format_date } from "../utils/helpers";

import { FaRegComment } from "react-icons/fa";

import { fetchFacts, fetchQuotes, fetchWords } from "../utils/API";

import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_LIKE,
  REMOVE_LIKE,
  ADD_COMMENT,
  UPDATE_COMMENT,
  REMOVE_COMMENT,
  ADD_FAVOURITE,
  REMOVE_FAVOURITE,
  ADD_REPLY,
  ADD_LIKE_TO_REPLY,
  ADD_REPLY_TO_REPLY,
  REMOVE_REPLY,
  ADD_COMMENT_LIKE,
  REMOVE_COMMENT_LIKE,
} from "../utils/mutations";
import { GET_LIKES, GET_ME, GET_COMMENTS, GET_ADMIN } from "../utils/queries";

const Home = ({ account, accountLevel }) => {
  const [commentData, setCommentData] = useState([]);
  const [userState, setUserState] = useState();

  const [currentCommentLikes, setCurrentCommentLikes] = useState([]);

  // * UnHide this when ready to use and upload to DB
  // const [facts, setFacts] = useState("");
  // const [quotes, setQuotes] = useState([]);
  // const [words, setWords] = useState([]);

  // * UnHide this when ready to use and upload to DB
  // if (words.title == "No Definitions Found") {
  //   fetchFunc(setWords, fetchWords);
  // }

  // const fetchFunc = async (state, func) => {
  //   state(await func());
  // };

  // useEffect(() => {
  //   fetchFunc(setFacts, fetchFacts);
  //   // * UnHide this when ready to use and upload to DB
  //   // fetchFunc(setQuotes, fetchQuotes);
  //   // fetchFunc(setWords, fetchWords);
  // }, []);

  let loggedIn =
    localStorage.getItem("id_token") == null
      ? false
      : localStorage.getItem("id_token") == "undefined"
      ? false
      : true;

  const FetchQuery = () => {
    const { loading, data } = useQuery(GET_LIKES);

    const comments = useQuery(GET_COMMENTS);

    var userData = useQuery(accountLevel == "Admin" ? GET_ADMIN : GET_ME, {
      variables: account ? { id: account.data._id } : { id: "blank" },
    });
    var user =
      accountLevel == "Admin"
        ? userData.data?.admin
        : userData.data?.get_me || [];

    var commentsState = comments.data?.comments || [];

    return { userData, user, comments, commentsState, data, loading };
  };

  let { user, userData, comments, commentsState, data, loading } = FetchQuery();

  useEffect(() => {
    setUserState(user);
    setCommentData(commentsState);
    // It's important we add the loading dependency as once it returns false, the useEffect will
    // Not run again, it will only run once AFTER all data has been sent to the useState variables
  }, [userData.loading, comments.loading]);

  const [addLike, { likeErr }] = useMutation(ADD_LIKE);
  const [removeLike, { removeLikeErr }] = useMutation(REMOVE_LIKE);
  const [addComment, { commentErr }] = useMutation(ADD_COMMENT);
  const [removeFavourite, { removeFavErr }] = useMutation(REMOVE_FAVOURITE);
  const [addFavourite, { addFavErr }] = useMutation(ADD_FAVOURITE);
  const [updateComment, { updateCommentErr }] = useMutation(UPDATE_COMMENT);
  const [removeComment, { removeCommentErr }] = useMutation(REMOVE_COMMENT);
  const [addReply, { addReplyErr }] = useMutation(ADD_REPLY);
  const [addLikeToReply, { addLikeToReplyErr }] =
    useMutation(ADD_LIKE_TO_REPLY);
  const [addReplyToReply, { addReplyToReplyErr }] =
    useMutation(ADD_REPLY_TO_REPLY);
  const [removeReply, { removeReplyErr }] = useMutation(REMOVE_REPLY);
  const [addCommentLike, { addCommentLikeErr }] = useMutation(ADD_COMMENT_LIKE);
  const [removeCommentLike, { removeCommentLikeErr }] =
    useMutation(REMOVE_COMMENT_LIKE);

  // The function to handle whether to add a like or to remove a like
  const handleLike = async (currentPostId, remove) => {
    // Before adding a like, check to see if likes exist
    if (!userData.loading) {
      // Then check to see if the specific post is already liked by the user
      if (remove) {
        // If currentLike has likes (that means the user has ACTIVE likes in this session)
        // Go through these since they are the MOST ACTIVE likes
        if (currentLikes.length > 0) {
          return currentLikes.forEach((like) => {
            if (currentPostId == like.postId) {
              removeCurrentLike(like._id);
            }
          });
        }
        // If like exists after refresh, e need to go through this since currentLikes is empty
        // currentLikes only fills once users start liking posts
        if (currentLikes.length < 1) {
          user.likedArr.forEach((like) => {
            if (currentPostId == like.postId) {
              removeCurrentLike(like._id);
            }
          });
        }
      } else {
        addNewLike(currentPostId);
      }
    } else {
      // If no likes exist at all, then execute function normally
      addNewLike(currentPostId);
    }
  };
  const returnPostInteractions = (currentPostId, specificPost) => {
    if (loggedIn && !userData.loading && user) {
      return (
        <div className="post-controls">
          <button
            // Check if the USER liked the post
            className={`likeBtn ${user.likedArr
              .map((like) => {
                if (like.postId == currentPostId) {
                  return `Checked`;
                }
              })
              // .join removes the comma that is added after/before 'Checked'
              .join("")}`}
            onClick={(e) => {
              let value = parseInt(
                document.querySelector(`.${specificPost}`).innerText
              );
              // Stop any other event above the button from triggering
              e.stopPropagation();
              if (e.target.className.includes("Checked")) {
                document.querySelector(`.${specificPost}`).innerText =
                  value -= 1;
                e.target.className = `likeBtn`;
                handleLike(currentPostId, true);
              } else {
                document.querySelector(`.${specificPost}`).innerText =
                  value += 1;
                e.target.className = "likeBtn Checked";
                handleLike(currentPostId, false);
              }
            }}
          >
            {/* CSS will determine which icon below will appear
          If button is checked, Fill heart will display, else, Outline will display */}
            <span className={"geo-post-0"} style={{ margin: "0" }}>
              {returnPostLikes(`current-geo-post-id`)}
            </span>
            <AiFillHeart
              style={{ pointerEvents: "none" }}
              className="fillHeart"
            />
            <AiOutlineHeart
              style={{ pointerEvents: "none" }}
              className="outlineHeart"
            />
          </button>
          <button
            onClick={() =>
              document
                .querySelector(".comment-outer-wrapper-0")
                .classList.toggle("hidden")
            }
          >
            {returnPostCommentsCounter(currentPostId, commentData)}
            <FaRegComment />
          </button>

          {loggedIn &&
            !userData.loading &&
            useState != undefined &&
            userState &&
            userState.favouritedArr != undefined && (
              <>
                <button
                  className={`favBtn ${userState.favouritedArr
                    .map((item) => {
                      if (item == currentPostId) {
                        return "Filled";
                      }
                    })
                    .join("")}`}
                  onClick={(e) => {
                    if (e.target.className.includes("Filled")) {
                      e.target.className = `favBtn`;
                      removeFavouritePost(currentPostId);
                    } else {
                      e.target.className = "favBtn Filled";
                      addNewFavourite(currentPostId);
                    }
                  }}
                >
                  <RiSaveLine
                    className="outlineSave"
                    style={{ fontSize: "25px" }}
                  />
                  <RiSaveFill
                    className="fillSave"
                    style={{ fontSize: "25px" }}
                  />
                </button>
              </>
            )}
        </div>
      );
    } else {
      return (
        <p style={{ margin: "0" }}>
          {" "}
          <AiOutlineHeart />
          Login to like and or save post
        </p>
      );
    }
  };

  const [currentLikes, setCurrentLikes] = useState([]);
  // The function to add a like to the DB and the users arr
  const addNewLike = async (postId) => {
    try {
      const like = await addLike({
        variables: {
          postId: postId,
          conjointId: `${postId}-${account.data._id}`,
          userId: account.data._id,
        },
      });

      // Manually push newly created like to a state object
      // This ensures state is FULLY update today
      // Then in the above function, we check this state object vs. userData since that is one step behind
      currentLikes.push(like.data?.addLike);

      return like;
    } catch (e) {
      // Clear state
      // console.log(e);
    }
  };

  // The function to remove a like from the DB and the users arr
  const removeCurrentLike = async (likeId) => {
    try {
      const like = await removeLike({
        variables: {
          likeId: likeId,
          userId: account.data._id,
        },
      });
      return like;
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  // Returns the amount of likes a post has
  const returnPostLikes = (activePostId) => {
    let counter = [];
    if (!loading && data) {
      data.likes.map((like) => {
        // Check if the post has LIKES in general (not just from the logged in user)
        if (like.postId == activePostId) {
          // Push the like (which also contains the usersId)
          counter.push(like);
        }
      });
      // Return the length of the counter which is the likes amount
      return counter.length;
    }
  };

  // The function to add a comment to the DB and the users arr
  const addNewComment = async (postId, text, e) => {
    e.preventDefault();

    try {
      let comment = await addComment({
        variables: {
          postId: postId,
          text: text,
          userId: account.data._id,
          username: account.data.username,
        },
      });
      setCommentData([...commentData, comment.data?.addComment]);
      setUserState({
        ...userState,
        commentsArr: [...userState.commentsArr, comment.data?.addComment],
      });
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addLikeToComment = async (commentId) => {
    try {
      await addCommentLike({
        variables: {
          commentId: commentId,
          userId: account.data._id,
        },
      });
      currentCommentLikes.push(account.data._id);

      // TODO: After you update the user model with a 'likesToCommentsArr'
      // TODO: Need to add the state update here
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const removeLikeFromComment = async (commentId) => {
    try {
      await removeCommentLike({
        variables: {
          commentId: commentId,
          userId: account.data._id,
        },
      });

      // TODO: After you update the user model with a 'likesToCommentsArr'
      // TODO: Need to add the state update here
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addReplyToComment = async (commentId, text, userId, username) => {
    try {
      let comment = await addReply({
        variables: {
          replyToSave: {
            text: text,
            commentId: commentId,
            userId: userId,
            username: username,
          },
        },
      });
      setCommentData([
        ...commentData.filter((dbComment) => dbComment._id !== commentId),
        comment.data?.addReply,
      ]);
      // TODO: After you update the user model with a 'replyToCommentsArr'
      // TODO: Need to add the user state update here
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const removeReplyFromComment = async (replyId, commentId) => {
    try {
      let comment = await removeReply({
        variables: {
          commentId: commentId,
          replyId: replyId,
        },
      });
      setCommentData([
        ...commentData.filter((dbComment) => dbComment._id !== commentId),
        comment.data?.removeReply,
      ]);
      // TODO: After you update the user model with a 'replyToCommentArr'
      // TODO: Need to add the user state update here
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addLikeToAReply = async (replyId, commentId) => {
    try {
      let comment = await addLikeToReply({
        variables: {
          commentId: commentId,
          replyId: replyId,
          userId: account.data._id,
        },
      });
      setCommentData([
        ...commentData.filter((dbComment) => dbComment._id !== commentId),
        comment.data?.addLikeToReply,
      ]);
      // TODO: After you update the user model with a 'likesToRepliesArr'
      // TODO: Need to add the user state update here
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addReplyToAReply = async ({ replyToReplySave }) => {
    try {
      let comment = await addReplyToReply({
        variables: {
          replyToReplySave: replyToReplySave,
        },
      });
      setCommentData([
        ...commentData.filter(
          (dbComment) => dbComment._id !== replyToReplySave.commentId
        ),
        comment.data?.addReplyToReply,
      ]);
      // TODO: After you update the user model with a 'repliesArr'
      // TODO: Need to add the user state update here
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const editCurrentComment = async (commentId, text) => {
    try {
      let comment = await updateComment({
        variables: {
          commentId: commentId,
          text: text,
        },
      });

      setCommentData([
        ...commentData.filter((dbComment) => dbComment._id !== commentId),
        comment.data?.updateComment,
      ]);

      setUserState({
        ...userState,
        commentsArr: [
          comment.data?.updateComment,
          ...userState.commentsArr.filter(
            (dbComment) => dbComment._id !== commentId
          ),
        ],
      });
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  // The function to remove a comment from the DB and the users arr
  const removeCurrentComment = async (commentId) => {
    try {
      let comment = await removeComment({
        variables: {
          commentId: commentId,
          userId: account.data._id,
        },
      });

      setCommentData(
        commentData.filter((dbComment) => dbComment._id !== commentId)
      );
      setUserState({
        ...userState,
        commentsArr: userState.commentsArr.filter(
          (dbComment) => dbComment._id !== commentId
        ),
      });
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const returnUserComment = (commentUserId) => {
    let isUsersCommment = false;
    if (loggedIn && !userData.loading && userState.length != 0) {
      userState.commentsArr.map((comment) => {
        if (comment.userId == commentUserId) {
          isUsersCommment = true;
        }
      });
      return isUsersCommment;
    }
  };

  const [edit, setEdit] = useState([false, 0]);

  const generateCommentEl = (commentsArr, activePostId) => {
    return (
      <div className="comment-outer-wrapper comment-outer-wrapper-0 hidden">
        {loggedIn ? (
          <form
            className="new-comment-form"
            onSubmit={(e) =>
              addNewComment(activePostId, e.target.text.value, e)
            }
          >
            <textarea name="text" placeholder="Add new comment"></textarea>
            <button name="uploadPost">Post</button>
          </form>
        ) : (
          <p>Login to Post and Reply to comments</p>
        )}
        <div className="comment-section">
          {commentsArr.map((comment, i) => {
            return (
              <div
                className={
                  returnUserComment(comment.userId) ? `users-comment` : ""
                }
              >
                <div className="comment-wrapper">
                  {comment.username}
                  <p
                    className={`single-comment ${
                      returnUserComment(comment.userId) ? `usersComment` : ""
                    }
                      ${
                        returnUserComment(comment.userId)
                          ? `users-comment-${i}`
                          : ""
                      }`}
                  >
                    {comment.text}{" "}
                    <>
                      <br></br>Posted {format_date(comment.createdAt)} ago -
                      Updated{" "}
                      {comment.updated && (
                        <>{format_date(comment.updatedAt)} ago</>
                      )}
                    </>
                  </p>
                  <div className="comment-controls-wrapper">
                    {returnUserComment(comment.userId) && (
                      <>
                        {edit[0] && edit[1] == i ? (
                          <>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                editCurrentComment(
                                  comment._id,
                                  e.target.text.value
                                );
                                setEdit([false, 0]);
                                document
                                  .querySelector(`.users-comment-${i}`)
                                  .classList.remove("hidden");
                              }}
                            >
                              <input
                                name="text"
                                defaultValue={comment.text}
                              ></input>
                              <button name="confirmEdit">Confirm</button>
                              <button
                                onClick={() => {
                                  setEdit([false, 0]);
                                  document
                                    .querySelector(`.users-comment-${i}`)
                                    .classList.remove("hidden");
                                }}
                              >
                                Cancel
                              </button>
                            </form>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              setEdit([true, i]);
                              document
                                .querySelector(`.users-comment-${i}`)
                                .classList.add("hidden");

                              // Remove 'hidden' from all userComments upon clicking edit
                              // To ensure everything resets
                              document
                                .querySelectorAll(".usersComment")
                                .forEach((comment) => {
                                  comment.classList.remove("hidden");
                                });
                            }}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => removeCurrentComment(comment._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {loggedIn ? (
                      <button
                        className={`commentLikeBtn ${comment.liked
                          .map((like) => {
                            if (like == account.data._id) {
                              return `commentLikeChecked`;
                            }
                          })
                          // .join removes the comma that is added after/before 'Checked'
                          .join("")}`}
                        onClick={(e) => {
                          let value = parseInt(
                            document.querySelector(`.comment-likes-${i}`)
                              .innerText
                          );
                          if (
                            e.target.className.includes("commentLikeChecked")
                          ) {
                            e.target.className = `commentLikeBtn`;
                            document.querySelector(
                              `.comment-likes-${i}`
                            ).innerText = value -= 1;

                            removeLikeFromComment(comment._id);
                          } else {
                            document.querySelector(
                              `.comment-likes-${i}`
                            ).innerText = value += 1;

                            e.target.className =
                              "commentLikeBtn commentLikeChecked";
                            addLikeToComment(comment._id);
                          }
                        }}
                      >
                        <div
                          style={{ pointerEvents: "none" }}
                          className={`comment-likes-${i}`}
                        >
                          {comment.liked.length}
                        </div>
                        <AiFillHeart
                          style={{ pointerEvents: "none" }}
                          className="fillHeart"
                        />
                        <AiOutlineHeart
                          style={{ pointerEvents: "none" }}
                          className="outlineHeart"
                        />
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ pointerEvents: "none" }}>
                          {comment.liked.length}
                        </span>
                        <AiOutlineHeart
                          style={{ pointerEvents: "none" }}
                          className="outlineHeart"
                        />
                        <p style={{ margin: "0" }}>Login to like replies</p>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        document
                          .querySelector(`.reply-section-${i}`)
                          .classList.toggle("hidden")
                      }
                    >
                      <span style={{ pointerEvents: "none" }}>
                        {comment.replies.length}
                      </span>
                      <FaRegComment />
                    </button>
                  </div>
                </div>
                <div
                  className={`reply-section-${i} reply-section-wrapper hidden`}
                >
                  <div className={`reply-section`}>
                    {comment.replies.length > 0 &&
                      comment.replies.map((reply, i) => {
                        return (
                          <div>
                            {reply.username} - {reply.text}
                            <p className="replies-to-reply-section">
                              {reply.replyToReply.map((reply) => {
                                return (
                                  <p>
                                    {reply.replyText} - {reply.username}
                                  </p>
                                );
                              })}
                            </p>
                            <div>
                              {loggedIn && (
                                <>
                                  <button
                                    onClick={() => {
                                      document
                                        .querySelector(
                                          `.reply-to-reply-${i}-${reply.commentId.slice(
                                            0,
                                            10
                                          )}`
                                        )
                                        .classList.toggle("hidden");
                                    }}
                                  >
                                    Reply
                                  </button>
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      addReplyToAReply({
                                        replyToReplySave: {
                                          commentId: reply.commentId,
                                          replyText: e.target.replyText.value,
                                          userId: account.data._id,
                                          replyId: reply._id,
                                          username: account.data.username,
                                        },
                                      });
                                    }}
                                    className={`reply-to-reply-input hidden reply-to-reply-${i}-${reply.commentId.slice(
                                      0,
                                      10
                                    )}`}
                                  >
                                    <input
                                      name="replyText"
                                      placeholder="Add reply"
                                    ></input>
                                    <button>Reply</button>
                                  </form>
                                  <button
                                    onClick={() =>
                                      addLikeToAReply(
                                        reply._id,
                                        reply.commentId
                                      )
                                    }
                                  >
                                    {reply.replyLikes &&
                                    reply.replyLikes.length > 0
                                      ? reply.replyLikes.length
                                      : 0}
                                    <AiOutlineHeart
                                      style={{ pointerEvents: "none" }}
                                    />
                                  </button>
                                </>
                              )}
                              {loggedIn && reply.userId == account.data._id && (
                                <div>
                                  <button>Edit</button>
                                  <button
                                    onClick={() =>
                                      removeReplyFromComment(
                                        reply._id,
                                        reply.commentId
                                      )
                                    }
                                  >
                                    X
                                  </button>
                                </div>
                              )}
                            </div>
                            <hr></hr>
                          </div>
                        );
                      })}
                  </div>
                  {loggedIn && (
                    <form
                      className="reply-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        addReplyToComment(
                          comment._id,
                          e.target.text.value,
                          account.data._id,
                          account.data.username
                        );
                      }}
                    >
                      <textarea name="text" placeholder="Add Reply"></textarea>
                      <button>Reply</button>
                    </form>
                  )}
                </div>
                <hr style={{ margin: "20px" }}></hr>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const returnPostCommentsCounter = (activePostId, commentState) => {
    let commentsArr = [];

    commentState.map((comment) => {
      if (comment.postId == activePostId) {
        commentsArr.push(comment);
      }
    });

    return commentsArr.length;
  };
  // Returns the comments a post has
  const returnPostComments = (activePostId, commentState) => {
    let commentsArr = [];

    commentState.map((comment) => {
      if (comment.postId == activePostId) {
        commentsArr.push(comment);
      }
    });

    commentsArr.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return generateCommentEl(commentsArr, activePostId);
  };

  const addNewFavourite = async (postId) => {
    try {
      const user = await addFavourite({
        variables: {
          postId: postId,
          userId: account.data._id,
        },
      });
      return user;
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  // TODO :: Make this one function
  // This is to be used in the home page (Separate from the favourites component)
  const removeFavouritePost = async (favouriteId) => {
    try {
      const user = await removeFavourite({
        variables: {
          favouriteId: favouriteId,
          userId: account.data._id,
        },
      });
      return user;
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  let facts = { topic: "te", description: "te" };
  return (
    <div>
      Home Page
      {/* // * UnHide below component when ready to use and upload to DB */}
      {/* <VocabWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        words={words}
        addNewLike={addNewLike}
        likes={!loading && data.likes}
      /> */}
      {/* <QuotesWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        quotes={quotes}
        addNewLike={addNewLike}
        removeCurrentLike={removeCurrentLike}
        likes={!loading && data.likes}
      /> */}
      {/* {facts && (
        <FactWrapper
          facts={facts}
          returnPostInteractions={returnPostInteractions}
          returnPostLikes={returnPostLikes}
          returnPostComments={returnPostComments}
        />
      )} */}
      {!loading && !comments.loading && (
        <GeoWrapper
          // TODO :
          // Here's how we can do realtime, we pass in the data directly from use query as a prop to a component
          // Then we assign the prop 'data' to a useState declaration const [a, setA] = useState(data)
          data={data}
          commentData={commentData}
          setCommentData={setCommentData}
          returnPostInteractions={returnPostInteractions}
          returnPostComments={returnPostComments}
        />
      )}
    </div>
  );
};

export default Home;
