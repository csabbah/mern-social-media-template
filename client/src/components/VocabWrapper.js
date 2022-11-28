import React, { useState } from "react";

const VocabWrapper = ({
  words,
  loggedIn,
  accountDetail,
  addNewLike,
  likes,
}) => {
  const [flipCard, setFlipCard] = useState({
    firstCard: false,
    secondCard: false,
    thirdCard: false,
  });

  const handleLike = (currentPostId) => {
    console.log(accountDetail);
    // Before adding a like, check to see if likes exist
    if (likes.length > 0) {
      likes.forEach((like) => {
        // Then check to see if the specific post is already liked by the user
        if (
          like.postId == currentPostId &&
          like.userId._id == accountDetail._id
        ) {
          return addNewLike(currentPostId, like._id, true);
        }
      });
      // If after above map method, it doesn't return true, then that means the
      // like is new, so post (add) the like
      addNewLike(currentPostId, null);
    } else {
      // If no likes exist at all, then execute function normally
      addNewLike(currentPostId, null);
    }
  };

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
                    }}
                  >
                    Read loud
                  </button>
                  {likes.map((like) => {
                    // TODO: Need to update this section - Future, should be vocab._id
                    if (like.postId == `current-vocab-post-id`) {
                      return <p>This post was liked</p>;
                    }
                  })}
                  {/* // TODO: Need to update this section - Would need to pass the real Object ID*/}
                  {loggedIn ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        /* // TODO: Need to update this section - Would need to pass the real Object ID*/
                        handleLike("current-vocab-post-id");
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
