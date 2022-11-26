import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import { GET_LIKES } from "../utils/queries";

const VocabWrapper = ({ words, loggedIn, accountDetail, addNewLike }) => {
  const [flipCard, setFlipCard] = useState({
    firstCard: false,
    secondCard: false,
    thirdCard: false,
  });

  const { loading, data } = useQuery(GET_LIKES);

  return (
    <div>
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
                  <button
                    onClick={(e) => {
                      // stopPropagation will ensure when this button is clicked
                      // It doesn't trigger the onclick above it
                      e.stopPropagation();
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
                  {!loading &&
                    data.likes.map((like) => {
                      // TODO: Need to update this section - Future, should be vocab._id
                      if (like.postId == `vocab#-1`) {
                        return <p>This post was liked</p>;
                      }
                    })}
                  {/* For reference - addNewLike(PostIdGoesHere) */}
                  {/* // TODO: Need to update this section - Would need to pass the real Object ID*/}
                  {loggedIn ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        addNewLike(`vocab#-1`);
                      }}
                    >
                      Like
                    </button>
                  ) : (
                    <p>Login to like</p>
                  )}
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
