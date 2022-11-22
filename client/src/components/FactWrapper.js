import React from "react";

const FactWrapper = ({ facts }) => {
  return (
    <div>
      {facts.length > 1 ? (
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
  );
};

export default FactWrapper;
