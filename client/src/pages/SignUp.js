import React, { useState, useEffect } from "react";

import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

import Auth from "../utils/auth";

const SignUp = () => {
  const [user, setUser] = useState({ email: "", username: "", password: "" });

  const handleUserSubmit = (e) => {
    e.preventDefault();

    // setUser({
    //   email: e.target.userEmail.value,
    //   password: e.target.userPass.value,
    // });
    console.log(user);
  };

  return (
    <div>
      <form onSubmit={(e) => handleUserSubmit(e)}>
        <h5>User Signup</h5>
        <input
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          name="userEmail"
          type="text"
          placeholder="Email Address"
        ></input>
        <input
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          name="userName"
          type="text"
          placeholder="Username"
        ></input>
        <input
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          name="userPass"
          type="password"
          placeholder="Password"
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SignUp;
