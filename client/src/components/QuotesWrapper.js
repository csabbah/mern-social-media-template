import React from "react";

const QuotesWrapper = ({ quotes }) => {
  return (
    <div>
      {quotes.length > 1 ? (
        <div className="quotes-wrapper">
          {quotes.map((quote, i) => {
            return (
              <div className="quotes-card" key={i}>
                <p>
                  {quote.author} / {quote.category}
                </p>
                <p>{quote.text}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QuotesWrapper;
