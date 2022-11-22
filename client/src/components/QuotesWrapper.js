import React from "react";

const QuotesWrapper = ({ quotes }) => {
  return (
    <div>
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
    </div>
  );
};

export default QuotesWrapper;
