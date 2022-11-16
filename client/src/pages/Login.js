import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import { LOGIN_ADMIN, LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Login = () => {
  const [errorUser, setErrorUser] = useState("");
  const [errorAdmin, setErrorAdmin] = useState("");

  const [loginAdmin, { adminErr }] = useMutation(LOGIN_ADMIN);
  const [login, { userErr }] = useMutation(LOGIN_USER);

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (e.target.userEmail.value && e.target.userPass.value) {
      try {
        const { data } = await login({
          variables: {
            email: e.target.userEmail.value,
            password: e.target.userPass.value,
          },
        });

        Auth.login(data.login.token);
      } catch (e) {
        setErrorUser("Incorrect Credentials");
      }
    } else {
      setErrorUser("Please fill in all required fields");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    if (e.target.adminEmail.value && e.target.adminPass.value) {
      try {
        const { data } = await loginAdmin({
          variables: {
            email: e.target.adminEmail.value,
            password: e.target.adminPass.value,
          },
        });

        Auth.login(data.loginAdmin.token);
      } catch (e) {
        setErrorAdmin("Incorrect Credentials");
      }
    }
    setErrorAdmin("Please fill in all required fields");
  };

  return (
    <div>
      <form onSubmit={(e) => handleUserSubmit(e)}>
        <h5>User Login</h5>
        <label htmlFor="userEmail">Email</label>
        <input
          id="userEmail"
          onChange={() => setErrorUser("")}
          name="userEmail"
          type="text"
          placeholder="Email Address"
        ></input>
        <label htmlFor="userPass">Password</label>
        <input
          id="userPass"
          onChange={() => setErrorUser("")}
          name="userPass"
          type="password"
          placeholder="Password"
        ></input>
        <button type="submit">Login</button>
        {errorUser && <p>{errorUser}</p>}
        {userErr && <div>Failed to Login. Email or Password is incorrect</div>}
      </form>
      <hr></hr>
      <form onSubmit={(e) => handleAdminSubmit(e)}>
        <h5>Admin Login</h5>
        <label htmlFor="adminEmail">Email</label>
        <input
          id="adminEmail"
          onChange={() => setErrorAdmin("")}
          name="adminEmail"
          type="text"
          placeholder="Email Address"
        ></input>
        <label htmlFor="adminPass">Password</label>
        <input
          id="adminPass"
          onChange={() => setErrorAdmin("")}
          name="adminPass"
          type="password"
          placeholder="Password"
        ></input>
        <button type="submit">Login</button>
        {errorAdmin && <p>{errorAdmin}</p>}
        {adminErr && <div>Failed to Login. Email or Password is incorrect</div>}
      </form>
    </div>
  );
};

export default Login;
