import React, { useState, useEffect } from "react";

import VocabWrapper from "../components/VocabWrapper";
import FactWrapper from "../components/FactWrapper";
import QuotesWrapper from "../components/QuotesWrapper";
import GeoWrapper from "../components/GeoWrapper";

import Auth from "../utils/auth";

import { fetchFacts, fetchQuotes, fetchWords } from "../utils/API";

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

  return (
    <div>
      Home Page
      {/* // TODO Need to add addLike function (Use function from FactWrapper) */}
      <VocabWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        words={words}
      />
      {/* // TODO Need to add addLike function (Use function from FactWrapper) */}
      <QuotesWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        quotes={quotes}
      />
      <FactWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        facts={facts}
      />
      {/* // TODO Need to add addLike function (Use function from FactWrapper) */}
      <GeoWrapper
        loggedIn={loggedIn}
        accountDetail={loggedIn && getAccountLevel()}
        geo={"test"}
      />
    </div>
  );
};

export default Home;
