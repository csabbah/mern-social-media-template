import React from "react";

import Auth from "../utils/auth";
import { test } from "../utils/API";

const Home = () => {
  const returnData = async () => {
    const res = await test();
    const data = await res.json();

    console.log(data);
  };

  return (
    <div>
      Home Page
      <button onClick={() => returnData()}>Search</button>
    </div>
  );
};

export default Home;
