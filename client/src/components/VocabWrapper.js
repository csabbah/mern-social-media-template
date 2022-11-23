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
      {console.log(words)}
      {words[0] ? (
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
                <p>
                  {words[0].word} / {words[0].meanings[0].partOfSpeech}
                </p>
              </div>
              <div className="card-back">
                <div className="card-back-inner">
                  {words[0].meanings ? (
                    <div>
                      {words[0].meanings.map((item) => {
                        return (
                          <div key={Math.ceil(Math.random() * 100000)}>
                            <div>
                              {item.definitions.map((definition) => {
                                return (
                                  <p key={Math.ceil(Math.random() * 100000)}>
                                    {definition.definition}
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VocabWrapper;
