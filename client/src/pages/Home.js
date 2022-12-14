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
  EDIT_REPLY,
  ADD_LIKE_TO_REPLY,
  ADD_REPLY_TO_REPLY,
  REMOVE_REPLY,
  ADD_COMMENT_LIKE,
  REMOVE_COMMENT_LIKE,
  REMOVE_INNER_REPLY,
  REMOVE_LIKE_FROM_REPLY,
} from "../utils/mutations";
import { GET_LIKES, GET_ME, GET_COMMENTS, GET_ADMIN } from "../utils/queries";

const Home = ({ account, accountLevel }) => {
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

  // * ------------------------------------------------------------ THIS SECTION RENDERS USERS DATA/COMMENTS AND SETS THE STATE OBJECTS FOR USE
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

  const [commentData, setCommentData] = useState([]);
  const [userState, setUserState] = useState();

  useEffect(() => {
    setUserState(user);
    setCommentData(commentsState);
    // It's important we add the loading dependency as once it returns false, the useEffect will
    // Not run again, it will only run once AFTER all data has been sent to the useState variables
  }, [userData.loading, comments.loading]);

  // * ------------------------------------------------------------ MUTATION DECLARATIONS
  const [addLike, { likeErr }] = useMutation(ADD_LIKE);
  const [removeLike, { removeLikeErr }] = useMutation(REMOVE_LIKE);
  const [addComment, { commentErr }] = useMutation(ADD_COMMENT);
  const [removeFavourite, { removeFavErr }] = useMutation(REMOVE_FAVOURITE);
  const [addFavourite, { addFavErr }] = useMutation(ADD_FAVOURITE);
  const [updateComment, { updateCommentErr }] = useMutation(UPDATE_COMMENT);
  const [removeComment, { removeCommentErr }] = useMutation(REMOVE_COMMENT);
  const [addReply, { addReplyErr }] = useMutation(ADD_REPLY);
  const [updateReply, { editReplyErr }] = useMutation(EDIT_REPLY);
  const [addLikeToReply, { addLikeToReplyErr }] =
    useMutation(ADD_LIKE_TO_REPLY);
  const [removeLikeFromReply, { removeLikeFromReplyErr }] = useMutation(
    REMOVE_LIKE_FROM_REPLY
  );
  const [addReplyToReply, { addReplyToReplyErr }] =
    useMutation(ADD_REPLY_TO_REPLY);
  const [removeInnerReply, { removeInnerReplyErr }] =
    useMutation(REMOVE_INNER_REPLY);
  const [removeReply, { removeReplyErr }] = useMutation(REMOVE_REPLY);
  const [addCommentLike, { addCommentLikeErr }] = useMutation(ADD_COMMENT_LIKE);
  const [removeCommentLike, { removeCommentLikeErr }] =
    useMutation(REMOVE_COMMENT_LIKE);

  // * ------------------------------------------------------------ ALL RESOLVER FUNCTIONS
  // The function to add a like to the DB and the users arr
  const addNewLike = async (postId) => {
    try {
      // TODO: Update resolver side to pass the data to the user model object - userInteraction.postLikes
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
      // TODO: Update resolver side to remove the data from the user model object - userInteraction.postLikes
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

  // The function to add a comment to the DB and the users arr
  const addNewComment = async (postId, text, e) => {
    e.preventDefault();

    try {
      // TODO: Update resolver side to pass the data to the user model object - userInteraction.comments
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

  const editCurrentComment = async (commentId, text) => {
    try {
      // TODO: Update resolver side to update the data from the user model object - userInteraction.comments
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
      // TODO: Update resolver side to remove the data from the user model object - userInteraction.comments
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

  const [currentCommentLikes, setCurrentCommentLikes] = useState([]);
  const addLikeToComment = async (commentId) => {
    try {
      // TODO: Update resolver side to pass the data to the user model object - userInteraction.commentLikes
      await addCommentLike({
        variables: {
          commentId: commentId,
          userId: account.data._id,
        },
      });
      // Push the comment likes into a state object (during session) to ensure that it accurately updates the DB
      currentCommentLikes.push(account.data._id);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const removeLikeFromComment = async (commentId) => {
    try {
      // TODO: Update resolver side to remove the data from the user model object - userInteraction.commentLikes
      await removeCommentLike({
        variables: {
          commentId: commentId,
          userId: account.data._id,
        },
      });
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addReplyToComment = async (commentId, text, userId, username) => {
    try {
      // TODO: Update resolver side to pass the data to the user model object - userInteraction.replies
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
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const editCurrentReply = async (commentId, text, replyId) => {
    try {
      // TODO: Update resolver side to update the data from the user model object - userInteraction.comments
      let comment = await updateReply({
        variables: {
          commentId: commentId,
          replyId: replyId,
          text: text,
        },
      });

      setCommentData([
        ...commentData.filter((dbComment) => dbComment._id !== commentId),
        comment.data?.updateReply,
      ]);

      setUserState({
        ...userState,
        commentsArr: [
          comment.data?.updateReply,
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

  const removeReplyFromComment = async (replyId, commentId) => {
    try {
      // TODO: Update resolver side to remove the data from the user model object - userInteraction.replies
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
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addLikeToAReply = async (replyId, commentId) => {
    try {
      // TODO: Update resolver side to pass the data to the user model object - userInteraction.replyLikes
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
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const removeLikeFromAReply = async (replyId, commentId) => {
    try {
      // TODO: Update resolver side to pass the data to the user model object - userInteraction.replyLikes
      let comment = await removeLikeFromReply({
        variables: {
          commentId: commentId,
          replyId: replyId,
          userId: account.data._id,
        },
      });
      setCommentData([
        ...commentData.filter((dbComment) => dbComment._id !== commentId),
        comment.data?.removeLikeFromReply,
      ]);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addReplyToAReply = async ({ replyToReplySave }) => {
    try {
      // TODO: Update resolver side to pass the data to the user model object - userInteraction.replies
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
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const removeAnInnerReply = async (replyId, commentId, innerReplyId) => {
    try {
      // TODO: Update resolver side to pass the data to the user model object - userInteraction.replies
      let comment = await removeInnerReply({
        variables: {
          replyId: replyId,
          innerReplyId: innerReplyId,
          commentId: commentId,
        },
      });
      setCommentData([
        ...commentData.filter((dbComment) => dbComment._id !== commentId),
        comment.data?.removeInnerReply,
      ]);
    } catch (e) {
      // Clear state
      console.log(e);
    }
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

  // * ------------------------------------------------------------ OTHER FUNCTIONS
  // This reduce height of any input/textarea
  // It uses setTimeout to ensure that if other elements are clicked, their events are fired off before the input closes
  const closeInput = (e) => {
    setTimeout(() => {
      e.target.style.height = "45px";
    }, 100);
  };

  const [currentLikes, setCurrentLikes] = useState([]);

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

  const returnPostCommentsCounter = (activePostId, commentState) => {
    let commentsArr = [];

    commentState.map((comment) => {
      if (comment.postId == activePostId) {
        commentsArr.push(comment);
      }
    });

    return commentsArr.length;
  };
  // * ------------------------------------------------------------ FUNCTIONS THAT RENDER ELEMENTS

  const [editComment, setEditComment] = useState([false, 0]);
  const [editReply, setEditReply] = useState([false, 0]);

  const returnPostInteractions = (currentPostId, specificPost) => {
    if (loggedIn && !userData.loading && user) {
      return (
        <div className="post-controls">
          <button
            // Check if the USER liked the post
            className={`likeBtn ${
              user &&
              user.likedArr &&
              user.likedArr
                .map((like) => {
                  if (like.postId == currentPostId) {
                    return `Checked`;
                  }
                })
                // .join removes the comma that is added after/before 'Checked'
                .join("")
            }`}
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
            <span className={"geo-post-0 counterEl"}>
              {returnPostLikes(`current-geo-post-id`)}
            </span>
            <AiFillHeart className="fillHeart" />
            <AiOutlineHeart className="outlineHeart" />
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
        <div style={{ margin: "15px", display: "flex", alignItems: "center" }}>
          {" "}
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
          <p style={{ margin: "0 10px" }}>Login to interact</p>
        </div>
      );
    }
  };

  const generateCommentEl = (commentsArr, activePostId) => {
    return (
      <div className="comment-outer-wrapper comment-outer-wrapper-0 hidden">
        {loggedIn && (
          <form
            className="new-comment-form"
            onSubmit={(e) =>
              addNewComment(activePostId, e.target.text.value, e)
            }
          >
            <textarea
              onFocus={(e) => {
                e.target.style.height = "125px";
              }}
              onBlur={(e) => {
                closeInput(e);
              }}
              className="add-comment-input"
              name="text"
              placeholder="Add new comment"
            ></textarea>
            <button name="uploadPost">Post</button>
          </form>
        )}
        <div className="comment-section">
          {commentsArr.map((comment, i) => {
            return (
              <div
                className={
                  account && comment.userId == account.data._id
                    ? `users-comment`
                    : ""
                }
              >
                <div className="comment-wrapper">
                  {comment.username}
                  <div
                    className={`single-comment-content ${
                      account && comment.userId == account.data._id
                        ? `usersComment`
                        : ""
                    }
                      ${
                        account && comment.userId == account.data._id
                          ? `users-comment-${i}`
                          : ""
                      }`}
                  >
                    {account && !comment.userId == account.data._id && (
                      <span>{comment.text}</span>
                    )}
                    {/* If it's logged in users comment, render this block */}
                    {account && comment.userId == account.data._id && (
                      <>
                        {editComment[0] && editComment[1] == i ? (
                          <form
                            className="edit-comment-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              editCurrentComment(
                                comment._id,
                                e.target.text.value
                              );
                              setEditComment([false, 0]);
                              document
                                .querySelector(`.users-comment-${i}`)
                                .classList.remove("hidden");
                            }}
                          >
                            <textarea
                              onFocus={(e) => {
                                e.target.style.height = "125px";
                              }}
                              onBlur={(e) => {
                                closeInput(e);
                              }}
                              className="edit-comment-input"
                              name="text"
                              defaultValue={comment.text}
                            ></textarea>
                            <div className="edit-comment-formBtns">
                              <button name="confirmEdit">Confirm</button>
                              <button
                                onClick={() => {
                                  setEditComment([false, 0]);
                                  document
                                    .querySelector(`.users-comment-${i}`)
                                    .classList.remove("hidden");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="users-comment-controls">
                            <span>{comment.text}</span>
                            <button
                              onClick={(e) => {
                                setEditComment([true, i]);
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
                            <button
                              onClick={() => removeCurrentComment(comment._id)}
                            >
                              X
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    <>
                      <p>
                        Posted {format_date(comment.createdAt)} ago
                        {comment.updated && <> - Updated</>}
                      </p>
                    </>
                  </div>
                  <div className="comment-controls">
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
                        <div className={`comment-likes-${i} counterEl`}>
                          {comment.liked.length}
                        </div>
                        <AiFillHeart className="fillHeart" />
                        <AiOutlineHeart className="outlineHeart" />
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="counterEl">
                          {comment.liked.length}
                        </span>
                        <AiOutlineHeart className="outlineHeart" />
                      </div>
                    )}
                    <button
                      onClick={() =>
                        document
                          .querySelector(`.reply-section-${i}`)
                          .classList.toggle("hidden")
                      }
                    >
                      <span className={"counterEl"}>
                        {comment.replies.length}
                      </span>
                      <FaRegComment />
                    </button>
                  </div>
                  <div
                    className={`reply-section-${i} reply-section-wrapper hidden`}
                  >
                    <div className={`reply-section`}>
                      {comment.replies.length > 0 &&
                        comment.replies.map((reply, i) => {
                          return (
                            <div>
                              <div
                                className={`users-reply-text reply-el ${
                                  loggedIn && reply.userId == account.data._id
                                    ? `users-reply-${i}`
                                    : ""
                                }`}
                              >
                                {reply.username} - {reply.text}
                              </div>
                              <div className="reply-outer-wrapper">
                                {loggedIn && (
                                  <div>
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
                                      className={`reply-to-reply-input hidden reply-${i}-${reply.commentId.slice(
                                        0,
                                        5
                                      )}`}
                                    >
                                      <textarea
                                        className={`add-innerReply-input innerReply-input-${reply._id}`}
                                        onFocus={(e) => {
                                          e.target.style.height = "125px";
                                        }}
                                        onBlur={(e) => {
                                          closeInput(e);
                                        }}
                                        style={{ marginBottom: "5px" }}
                                        name="replyText"
                                        placeholder="Add reply"
                                      ></textarea>
                                      <button
                                        onClick={(e) => {
                                          document
                                            .querySelectorAll(
                                              `.reply-${i}-${reply.commentId.slice(
                                                0,
                                                5
                                              )}`
                                            )
                                            .forEach((el) => {
                                              el.classList.toggle("hidden");
                                            });
                                        }}
                                        type="submit"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        type="button"
                                        style={{ marginLeft: "5px" }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          document
                                            .querySelectorAll(
                                              `.reply-${i}-${reply.commentId.slice(
                                                0,
                                                5
                                              )}`
                                            )
                                            .forEach((el) => {
                                              el.classList.toggle("hidden");
                                            });
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </form>
                                    <div
                                      className={`reply-controls reply-${i}-${reply.commentId.slice(
                                        0,
                                        5
                                      )}`}
                                    >
                                      <button
                                        className={`reply-el reply-btn-${reply._id} users-reply-${i}`}
                                        onClick={() => {
                                          document
                                            .querySelectorAll(
                                              `.reply-${i}-${reply.commentId.slice(
                                                0,
                                                5
                                              )}`
                                            )
                                            .forEach((el) => {
                                              el.classList.toggle("hidden");
                                            });
                                        }}
                                      >
                                        Reply
                                      </button>
                                      <button
                                        className={`replyLikeBtn reply-el users-reply-${i} ${reply.replyLikes
                                          .map((reply) => {
                                            if (reply == account.data._id) {
                                              return `replyLikeChecked`;
                                            }
                                          })
                                          // .join removes the comma that is added after/before 'Checked'
                                          .join("")}`}
                                        onClick={(e) => {
                                          let value = parseInt(
                                            document.querySelector(
                                              `.reply-likes-${i}`
                                            ).innerText
                                          );

                                          if (
                                            e.target.className.includes(
                                              "replyLikeChecked"
                                            )
                                          ) {
                                            e.target.className = `replyLikeBtn`;
                                            document.querySelector(
                                              `.reply-likes-${i}`
                                            ).innerText = value -= 1;
                                            removeLikeFromAReply(
                                              reply._id,
                                              reply.commentId
                                            );
                                          } else {
                                            document.querySelector(
                                              `.reply-likes-${i}`
                                            ).innerText = value += 1;

                                            e.target.className =
                                              "replyLikeBtn replyLikeChecked";

                                            addLikeToAReply(
                                              reply._id,
                                              reply.commentId
                                            );
                                          }
                                        }}
                                      >
                                        <span
                                          className={`reply-likes-${i} counterEl`}
                                        >
                                          {reply.replyLikes &&
                                          reply.replyLikes.length > 0
                                            ? reply.replyLikes.length
                                            : 0}
                                        </span>
                                        <AiFillHeart className="fillHeart" />
                                        <AiOutlineHeart className="outlineHeart" />
                                      </button>
                                      {reply.userId == account.data._id && (
                                        <>
                                          {editReply[0] && editReply[1] == i ? (
                                            <form
                                              className="edit-comment-form"
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                editCurrentReply(
                                                  reply.commentId,
                                                  e.target.text.value,
                                                  reply._id
                                                );
                                                setEditReply([false, 0]);
                                                document
                                                  .querySelectorAll(
                                                    `.users-reply-${i}`
                                                  )
                                                  .forEach((el) => {
                                                    el.classList.remove(
                                                      "hidden"
                                                    );
                                                  });
                                              }}
                                            >
                                              <textarea
                                                onFocus={(e) => {
                                                  e.target.style.height =
                                                    "125px";
                                                }}
                                                onBlur={(e) => {
                                                  closeInput(e);
                                                }}
                                                className="edit-comment-input"
                                                name="text"
                                                defaultValue={reply.text}
                                              ></textarea>
                                              <div className="edit-comment-formBtns">
                                                <button name="confirmEdit">
                                                  Confirm
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    setEditReply([false, 0]);
                                                    document
                                                      .querySelectorAll(
                                                        `.users-reply-${i}`
                                                      )
                                                      .forEach((el) => {
                                                        el.classList.remove(
                                                          "hidden"
                                                        );
                                                      });
                                                  }}
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </form>
                                          ) : (
                                            <div className="users-comment-controls">
                                              <button
                                                onClick={(e) => {
                                                  // Remove 'hidden' from all userComments upon clicking edit
                                                  // To ensure everything resets
                                                  document
                                                    .querySelectorAll(
                                                      ".reply-el"
                                                    )
                                                    .forEach((comment) => {
                                                      comment.classList.remove(
                                                        "hidden"
                                                      );
                                                    });
                                                  setEditReply([true, i]);
                                                  document
                                                    .querySelectorAll(
                                                      `.users-reply-${i}`
                                                    )
                                                    .forEach((el) => {
                                                      el.classList.add(
                                                        "hidden"
                                                      );
                                                    });
                                                }}
                                              >
                                                Edit
                                              </button>
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
                                        </>
                                      )}
                                    </div>
                                    {/* // * ------------------------------------------------------------ REPLIES TO A REPLY SECTION */}
                                    {reply.replyToReply.length > 0 && (
                                      <div
                                        className={`replies-to-reply-section reply-el users-reply-${i}`}
                                      >
                                        {generateRepliesToReplyEl(
                                          reply.replyToReply
                                        )}
                                      </div>
                                    )}
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
                        <textarea
                          className="add-reply-to-comment-input"
                          onFocus={(e) => {
                            e.target.style.height = "125px";
                          }}
                          onBlur={(e) => {
                            closeInput(e);
                          }}
                          name="text"
                          placeholder="Add Reply"
                        ></textarea>
                        <button>Reply</button>
                      </form>
                    )}
                  </div>
                </div>
                <hr style={{ margin: "25px" }}></hr>
              </div>
            );
          })}
        </div>
      </div>
    );
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

  const generateRepliesToReplyEl = (repliesToReplies) => {
    return repliesToReplies.map((reply, i) => {
      return (
        <p style={{ margin: "0" }}>
          {reply.replyText} - {reply.username} <button>Edit</button>
          <button>
            <AiFillHeart className="fillHeart" />
            {/* <AiOutlineHeart className="outlineHeart" /> */}
          </button>
          <button
            onClick={() => {
              document.querySelector(`.reply-btn-${reply.replyId}`).click();
              document.querySelector(
                `.innerReply-input-${reply.replyId}`
              ).value = `Reply to ${reply.username} `;

              document
                .querySelector(`.innerReply-input-${reply.replyId}`)
                .focus();
            }}
          >
            Reply
          </button>
          <button
            onClick={() =>
              removeAnInnerReply(reply.replyId, reply.commentId, reply._id)
            }
          >
            X
          </button>
        </p>
      );
    });
  };

  // * ------------------------------------------------------------ MAIN RENDER BLOCK

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
