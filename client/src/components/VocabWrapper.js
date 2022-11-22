import React, { useState } from "react";

const VocabWrapper = ({ words }) => {
  console.log(words);

  const [flipCard, setFlipCard] = useState({
    firstCard: false,
    secondCard: false,
    thirdCard: false,
  });

  return (
    <div>
      <div className="vocab-wrapper">
        <div
          onClick={(e) => {
            setFlipCard((prevState) => ({
              ...flipCard,
              firstCard: !prevState.firstCard,
            }));
          }}
          className="vocab-card"
        >
          <div
            className={`flip-card-inner ${
              flipCard.firstCard == true && "active"
            }`}
          >
            <div className="card-front">
              <p>Word</p>
            </div>
            <div className="card-back">
              <div className="card-back-inner">
                <p>This is the definition of the word.</p>
                <p>Noun</p>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={(e) => {
            setFlipCard((prevState) => ({
              ...flipCard,
              secondCard: !prevState.secondCard,
            }));
          }}
          className="vocab-card"
        >
          <div
            className={`flip-card-inner ${
              flipCard.secondCard == true && "active"
            }`}
          >
            <div className="card-front">
              <p>Word</p>
            </div>
            <div className="card-back">
              <div className="card-back-inner">
                <p>This is the definition of the word.</p>
                <p>Noun</p>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={(e) => {
            setFlipCard((prevState) => ({
              ...flipCard,
              thirdCard: !prevState.thirdCard,
            }));
          }}
          className="vocab-card"
        >
          <div
            className={`flip-card-inner ${
              flipCard.thirdCard == true && "active"
            }`}
          >
            <div className="card-front">
              <p>Word</p>
            </div>
            <div className="card-back">
              <div className="card-back-inner">
                <p>This is the definition of the word.</p>
                <p>Noun</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default VocabWrapper;
