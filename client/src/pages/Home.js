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
} from "../utils/mutations";
import { GET_LIKES, GET_ME, GET_COMMENTS, GET_ADMIN } from "../utils/queries";

const Home = ({ account, accountLevel }) => {
  const [commentData, setCommentData] = useState([]);
  const [userState, setUserState] = useState();

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

  // Check if a user liked a given post, if so, add a specific class which will be check in the above function
  // To determine if a new like should be added or removed
  const returnUserLike = (currentPostId, specificPost) => {
    if (loggedIn && !userData.loading) {
      return (
        <>
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
            <AiFillHeart className="fillHeart" />
            <AiOutlineHeart className="outlineHeart" />
          </button>

          {loggedIn &&
          !userData.loading &&
          useState != undefined &&
          userState &&
          userState.favouritedArr != undefined ? (
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
                <RiSaveFill className="fillSave" style={{ fontSize: "25px" }} />
              </button>
            </>
          ) : (
            <p>Login to save post</p>
          )}
        </>
      );
    } else {
      return <p>Login to like</p>;
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
                <p>{format_date(comment.createdAt)}</p>
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
                          <button name="confirmEdit" type="submit">
                            Confirm
                          </button>
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
              addNewComment(activePostId, e.target.text.value, e)
            }
          >
            <input name="text" placeholder="Add new comment"></input>
            <button name="uploadPost" type="Submit">
              Post
            </button>
          </form>
        ) : (
          <p>Login to Comment</p>
        )}
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
      return new Date(b.updatedAt) - new Date(a.updatedAt);
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
          returnUserLike={returnUserLike}
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
          returnUserLike={returnUserLike}
          returnPostLikes={returnPostLikes}
          returnPostComments={returnPostComments}
        />
      )}
    </div>
  );
};

export default Home;
