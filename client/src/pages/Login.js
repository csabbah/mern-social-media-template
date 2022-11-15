import React, { useState, useEffect } from "react";

import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

import Auth from "../utils/auth";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [admin, setAdmin] = useState({ email: "", password: "" });

  const handleUserSubmit = (e) => {
    e.preventDefault();

    // setUser({
    //   email: e.target.userEmail.value,
    //   password: e.target.userPass.value,
    // });
    console.log(user);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();

    // setAdmin({
    //   email: e.target.adminEmail.value,
    //   password: e.target.adminPass.value,
    // });
    console.log(admin);
  };

  return (
    <div>
      <form onSubmit={(e) => handleUserSubmit(e)}>
        <h5>User Login</h5>
        <input
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          name="userEmail"
          type="text"
          placeholder="Email Address"
        ></input>
        <input
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          name="userPass"
          type="password"
          placeholder="Password"
        ></input>
        <button type="submit">Login</button>
      </form>
      <hr></hr>
      <form onSubmit={(e) => handleAdminSubmit(e)}>
        <h5>Admin Login</h5>
        <input
          onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
          name="adminEmail"
          type="text"
          placeholder="Email Address"
        ></input>
        <input
          onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          name="adminPass"
          type="password"
          placeholder="Password"
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
