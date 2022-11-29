import React, { useState, useEffect } from "react";

import VocabWrapper from "../components/VocabWrapper";
import FactWrapper from "../components/FactWrapper";
import QuotesWrapper from "../components/QuotesWrapper";
import GeoWrapper from "../components/GeoWrapper";

import Auth from "../utils/auth";

import { fetchFacts, fetchQuotes, fetchWords } from "../utils/API";

import { useMutation, useQuery } from "@apollo/client";
import { ADD_LIKE, REMOVE_LIKE } from "../utils/mutations";
import { GET_LIKES, GET_USER } from "../utils/queries";

const Home = () => {
  const { loading, data } = useQuery(GET_LIKES);

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

  const getAccountLevel = () => {
    return Auth.getProfile().data;
  };

  const GetAccount = () => {
    let userData = Auth.getProfile();

    let user = useQuery(GET_USER, {
      variables: { id: userData.data._id },
    });
    return user;
  };

  if (loggedIn) {
    getAccountLevel();
    var user = GetAccount();
  } else {
    var user = null;
  }

  const [addLike, { likeErr }] = useMutation(ADD_LIKE);
  const [removeLike, { removeLikeErr }] = useMutation(REMOVE_LIKE);

  // The function to handle whether to add a like or to remove a like
  const handleLike = (currentPostId, className) => {
    // Before adding a like, check to see if likes exist
    if (!loading) {
      if (user.data.user.likedArr.length > 0) {
        // Then check to see if the specific post is already liked by the user
        if (className == "Checked") {
          user.data.user.likedArr.forEach((like) => {
            if (currentPostId == like.postId) {
              console.log("Remove Like");
              return removeCurrentLike(like._id);
            }
          });
        } else {
          addNewLike(currentPostId);
        }
      } else {
        //   If no likes exist at all, then execute function normally
        addNewLike(currentPostId);
      }
    }
  };

  // Check if a user liked a given post, if so, add a specific class which will be check in the above function
  // To determine if a new like should be added or removed
  const returnUserLike = (currentPostId) => {
    if (loggedIn && !user.loading) {
      return (
        <button
          // Check if the USER liked the post
          className={
            loggedIn &&
            user.data.user.likedArr
              .map((like) => {
                if (like.postId == currentPostId) {
                  return `Checked`;
                }
              })
              // .join removes the comma that is added after/before 'Checked'
              .join("")
          }
          onClick={(e) => {
            e.stopPropagation();
            handleLike(currentPostId, e.target.className);
          }}
        >
          Like
        </button>
      );
    } else {
      return <p>Login to like</p>;
    }
  };

  // The function to add a like to the DB and the users arr
  const addNewLike = async (postId) => {
    try {
      return await addLike({
        variables: {
          postId: postId,
          userId: getAccountLevel()._id,
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
      return await removeLike({
        variables: {
          likeId: likeId,
          userId: getAccountLevel()._id,
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
    if (!loading) {
      data.likes.map((like) => {
        // Check if the post has LIKES in general (not just from the logged in user)
        if (like.postId == activePostId) {
          // Push the like (which also contains the usersId)
          counter.push(like);
        }
      });
    }
    // Return the length of the counter which is the likes amount
    return counter.length;
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
        facts={facts}
        returnUserLike={returnUserLike}
        returnPostLikes={returnPostLikes}
      />
      <GeoWrapper
        returnUserLike={returnUserLike}
        returnPostLikes={returnPostLikes}
        geo={"test"}
      />
    </div>
  );
};

export default Home;
