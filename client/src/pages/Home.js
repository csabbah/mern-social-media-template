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

  const handleLike = (currentPostId, className) => {
    // Before adding a like, check to see if likes exist
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
  };

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
        loggedIn={loggedIn}
        userDetail={loggedIn && user.data}
        userLoading={user != null && user.loading}
        postLoading={loading}
        facts={facts}
        handleLike={handleLike}
        postLikes={!loading && data.likes}
      />
      <GeoWrapper
        loggedIn={loggedIn}
        userLoading={user != null && user.loading}
        postLoading={loading}
        userDetail={loggedIn && user.data}
        handleLike={handleLike}
        geo={"test"}
        postLikes={!loading && data.likes}
      />
    </div>
  );
};

export default Home;
