import React, { useState, useEffect } from "react";

import { useMutation } from "@apollo/client";

import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const SignUp = () => {
  const [addUser, { error }] = useMutation(ADD_USER);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (
      e.target.userEmail.value &&
      e.target.userName.value &&
      e.target.userPass.value
    ) {
      // use try/catch instead of promises to handle errors
      try {
        // execute addCompany mutation and pass in variable data from form
        const { data } = await addUser({
          variables: {
            username: e.target.userName.value,
            password: e.target.userPass.value,
            email: e.target.userEmail.value,
          },
        });

        Auth.login(data.addUser.token);
      } catch (e) {
        // Clear state
        console.log(e);
      }
    } else {
      setErrorMessage("Please fill in all fields");
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleUserSubmit(e)}>
        <h5>User Signup</h5>
        <label htmlFor="userEmail">Email</label>
        <input
          id="userEmail"
          onChange={(e) => {
            setErrorMessage("");
          }}
          name="userEmail"
          type="text"
          placeholder="Email Address"
        ></input>
        <label htmlFor="userName">Username</label>
        <input
          id="userName"
          onChange={(e) => {
            setErrorMessage("");
          }}
          name="userName"
          type="text"
          placeholder="Username"
        ></input>
        <label htmlFor="userPass">Password</label>
        <input
          id="userPass"
          onChange={(e) => {
            setErrorMessage("");
          }}
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
          <div>
            Failed to Signup. Possible Reason: Email or Username already exists
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUp;
