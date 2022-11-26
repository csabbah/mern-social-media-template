import React, { useState, useEffect } from "react";

import VocabWrapper from "../components/VocabWrapper";
import FactWrapper from "../components/FactWrapper";
import QuotesWrapper from "../components/QuotesWrapper";
import GeoWrapper from "../components/GeoWrapper";

import Auth from "../utils/auth";

import { fetchFacts, fetchQuotes, fetchWords } from "../utils/API";

import { useMutation } from "@apollo/client";
import { ADD_LIKE } from "../utils/mutations";

const Home = () => {
  const [facts, setFacts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [words, setWords] = useState([]);

  const fetchFunc = async (state, func) => {
    state(await func());
  };

  useEffect(() => {
    fetchFunc(setFacts, fetchFacts);
    fetchFunc(setQuotes, fetchQuotes);
    fetchFunc(setWords, fetchWords);
  }, []);

  if (words.title == "No Definitions Found") {
    fetchFunc(setWords, fetchWords);
  }

  const getAccountLevel = () => {
    return Auth.getProfile().data;
  };

  let loggedIn =
    localStorage.getItem("id_token") == null
      ? false
      : localStorage.getItem("id_token") == "undefined"
      ? false
      : true;

  if (loggedIn) {
    getAccountLevel();
  }

  const [addLike, { likeErr }] = useMutation(ADD_LIKE);

  // TODO: Add function to not allow users to like a post again (check liked boolean)
  const addNewLike = async (postId) => {
    try {
      await addLike({
        variables: {
          // TODO: Once you return data from DB, need to use the real object ID
          postId: postId,
          userId: loggedIn && getAccountLevel()._id,
          liked: true,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  return (
    <div>
      Home Page
      <VocabWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        words={words}
        addNewLike={addNewLike}
      />
      <QuotesWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        quotes={quotes}
        addNewLike={addNewLike}
      />
      <FactWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        facts={facts}
        addNewLike={addNewLike}
      />
      <GeoWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        geo={"test"}
        addNewLike={addNewLike}
      />
    </div>
  );
};

export default Home;
