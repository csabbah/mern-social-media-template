import React, { useState, useEffect } from "react";

import VocabWrapper from "../components/VocabWrapper";
import FactWrapper from "../components/FactWrapper";
import QuotesWrapper from "../components/QuotesWrapper";
import GeoWrapper from "../components/GeoWrapper";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Auth from "../utils/auth";

import { FaRegComment } from "react-icons/fa";

import { fetchFacts, fetchQuotes, fetchWords } from "../utils/API";

import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_LIKE,
  REMOVE_LIKE,
  ADD_COMMENT,
  UPDATE_COMMENT,
  REMOVE_COMMENT,
} from "../utils/mutations";
import { GET_LIKES, GET_ME, GET_COMMENTS } from "../utils/queries";

const Home = ({ account }) => {
  const { loading, data } = useQuery(GET_LIKES);
  const comments = useQuery(GET_COMMENTS);

  const [facts, setFacts] = useState([]);
  // * UnHide this when ready to use and upload to DB
  // const [quotes, setQuotes] = useState([]);
  // const [words, setWords] = useState([]);

  const fetchFunc = async (state, func) => {
    state(await func());
  };

  useEffect(() => {
    fetchFunc(setFacts, fetchFacts);
    // * UnHide this when ready to use and upload to DB
    // fetchFunc(setQuotes, fetchQuotes);
    // fetchFunc(setWords, fetchWords);
  }, []);

  // * UnHide this when ready to use and upload to DB
  // if (words.title == "No Definitions Found") {
  //   fetchFunc(setWords, fetchWords);
  // }

  let loggedIn =
    localStorage.getItem("id_token") == null
      ? false
      : localStorage.getItem("id_token") == "undefined"
      ? false
      : true;

  var userData = useQuery(GET_ME, {
    variables: account ? { id: account.data._id } : { id: "blank" },
  });
  var user = userData.data?.get_me || [];

  const [addLike, { likeErr }] = useMutation(ADD_LIKE);
  const [removeLike, { removeLikeErr }] = useMutation(REMOVE_LIKE);
  const [addComment, { commentErr }] = useMutation(ADD_COMMENT);
  const [updateComment, { updateCommentErr }] = useMutation(UPDATE_COMMENT);
  const [removeComment, { removeCommentErr }] = useMutation(REMOVE_COMMENT);

  // The function to handle whether to add a like or to remove a like
  const handleLike = (currentPostId, remove) => {
    // Before adding a like, check to see if likes exist
    if (!userData.loading) {
      // Then check to see if the specific post is already liked by the user
      if (remove) {
        user.likedArr.forEach((like) => {
          if (currentPostId == like.postId) {
            return removeCurrentLike(like._id);
          }
        });
      } else {
        addNewLike(currentPostId);
      }
    } else {
      // If no likes exist at all, then execute function normally
      addNewLike(currentPostId);
    }
  };

  // Check if a user liked a given post, if so, add a specific class which will be check in the above function
  // To determine if a new like should be added or removed
  const returnUserLike = (currentPostId, specificPost) => {
    if (loggedIn && !userData.loading) {
      return (
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
              document.querySelector(`.${specificPost}`).innerText = value -= 1;
              e.target.className = `likeBtn`;
              handleLike(currentPostId, true);
            } else {
              document.querySelector(`.${specificPost}`).innerText = value += 1;
              e.target.className = "likeBtn Checked";
              handleLike(currentPostId, false);
            }
          }}
        >
          {/* CSS will determine which icon below will appear
          If button is checked, Fill heart will display, else, Outline will display */}
          <AiFillHeart className="fillHeart" />
          <AiOutlineHeart className="outlineHeart" />
        </button>
      );
    } else {
      return <p>Login to like</p>;
    }
  };

  // The function to add a like to the DB and the users arr
  const addNewLike = async (postId) => {
    try {
      await addLike({
        variables: {
          postId: postId,
          conjointId: `${postId}-${account.data._id}`,
          userId: account.data._id,
        },
      });
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  // The function to remove a like from the DB and the users arr
  const removeCurrentLike = async (likeId) => {
    try {
      await removeLike({
        variables: {
          likeId: likeId,
          userId: account.data._id,
        },
      });
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
      await addComment({
        variables: {
          postId: postId,
          text: text,
          userId: account.data._id,
          username: account.data.username,
        },
      });
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const editCurrentComment = async (commentId, text) => {
    try {
      await updateComment({
        variables: {
          commentId: commentId,
          text: text,
        },
      });
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const returnUserComment = (commentUserId) => {
    let isUsersCommment = false;
    if (loggedIn && !userData.loading) {
      user.commentsArr.map((comment) => {
        if (comment.userId == commentUserId) {
          isUsersCommment = true;
        }
      });
      return isUsersCommment;
    }
  };

  // The function to remove a comment from the DB and the users arr
  const removeCurrentComment = async (commentId) => {
    try {
      await removeComment({
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

  const [edit, setEdit] = useState([false, 0]);

  // Returns the comments a post has
  const returnPostComments = (activePostId) => {
    let commentsArr = [];
    if (!comments.loading) {
      comments.data.comments.map((comment) => {
        if (comment.postId == activePostId) {
          commentsArr.push(comment);
        }
      });
    }

    return (
      <div>
        <div>
          {commentsArr.length}
          <FaRegComment />
        </div>
        <div className="comment-section">
          {commentsArr.map((comment, i) => {
            return (
              <div
                className={
                  returnUserComment(comment.userId) ? `users-comment` : ""
                }
              >
                {comment.username && comment.username}
                <p
                  className={
                    returnUserComment(comment.userId)
                      ? `users-comment-${i}`
                      : ""
                  }
                  style={
                    returnUserComment(comment.userId)
                      ? {
                          backgroundColor: "rgba(0,0,0,0.1)",
                        }
                      : {}
                  }
                >
                  {comment.text}
                </p>

                {/* If it's the users comment, allow them to delete their comments */}
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
                          }}
                        >
                          <input
                            name="text"
                            defaultValue={comment.text}
                          ></input>
                          <button type="submit">Confirm</button>
                        </form>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          setEdit([true, i]);
                          document
                            .querySelector(`.users-comment-${i}`)
                            .classList.add("hidden");
                        }}
                      >
                        Edit
                      </button>
                    )}

                    <button onClick={() => removeCurrentComment(comment._id)}>
                      X
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {loggedIn ? (
          <form
            onSubmit={(e) =>
              addNewComment(`current-geo-post-id`, e.target.text.value, e)
            }
          >
            <input name="text" placeholder="Add new comment"></input>
            <button>Post</button>
          </form>
        ) : (
          <p>Login to Comment</p>
        )}
      </div>
    );
  };

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
      <FactWrapper
        facts={facts && facts}
        returnUserLike={returnUserLike}
        returnPostLikes={returnPostLikes}
        returnPostComments={returnPostComments}
      />
      <GeoWrapper
        returnUserLike={returnUserLike}
        returnPostLikes={returnPostLikes}
        returnPostComments={returnPostComments}
        geo={"test"}
      />
    </div>
  );
};

export default Home;
