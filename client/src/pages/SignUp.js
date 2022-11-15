import React, { useState, useEffect } from "react";

import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const SignUp = () => {
  const [addUser, { error }] = useMutation(ADD_USER);
  const [user, setUser] = useState({ email: "", username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (user.email && user.username && user.password) {
      // use try/catch instead of promises to handle errors
      try {
        // execute addCompany mutation and pass in variable data from form
        const { data } = await addUser({
          variables: { ...user },
        });

        Auth.login(data.addUser.token);
      } catch (e) {
        // Clear state
        setUser({ email: "", username: "", password: "" });
      }
    } else {
      setErrorMessage("Please fill in all fields");
    }

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
        <button type="submit">Sign Up</button>
        {errorMessage && (
          <div>
            <p className="error-text">{errorMessage}</p>
          </div>
        )}
        {error && (
          <div id="error-message">
            Failed to add Signup. Possible Reason: Name, Email or Username
            already exists
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUp;
