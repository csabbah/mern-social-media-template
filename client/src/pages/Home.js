import React, { useState, useEffect } from "react";

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
      <div>
        {words[0] ? (
          <div style={{ marginTop: "50px" }}>
            <p>Your Vocabulary:</p>
            <p>Word: {words[0].word}</p>
            <button
              onClick={() => {
                let utter = new SpeechSynthesisUtterance();
                utter.lang = "en-US";
                utter.text = words[0].word;
                utter.volume = 0.5;

                window.speechSynthesis.speak(utter);
                // event after text has been spoken
                // utter.onend = function () {
                //   alert("Speech has finished");
                // };
              }}
            >
              Read loud
            </button>
            {words[0].meanings ? (
              <div>
                {words[0].meanings.map((item) => {
                  return (
                    <div key={Math.ceil(Math.random() * 100000)}>
                      <p>{item.partOfSpeech}</p>
                      <div>
                        {item.definitions.map((definition) => {
                          return (
                            <p key={Math.ceil(Math.random() * 100000)}>
                              Definition: {definition.definition}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              "No definition found"
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {quotes.length > 1 ? (
          <ul style={{ marginTop: "50px" }}>
            <p>Your daily Quotes:</p>
            {quotes.map((quote, i) => {
              return (
                <li key={i}>
                  <p>Author: {quote.author}</p>
                  <p>Category: {quote.category}</p>
                  <p>{quote.text}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
        {facts && facts.length > 1 ? (
          <ul style={{ marginTop: "50px" }}>
            <p>Your daily facts:</p>
            {facts.map((fact, i) => {
              return (
                <li key={i}>
                  <p>Category: {fact.topic}</p>
                  <p>{fact.description}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
