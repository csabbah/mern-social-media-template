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

  return (
    <div>
      Home Page
      <button onClick={() => console.log(true)}>Search</button>
      <VocabWrapper words={words}></VocabWrapper>
      <QuotesWrapper quotes={quotes} />
      <FactWrapper facts={facts} />
      <GeoWrapper geo={"test"} />
    </div>
  );
};

export default Home;
