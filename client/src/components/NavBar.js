import React from "react";
import Auth from "../utils/auth";

const NavBar = ({ loggedIn }) => {
  return (
    <nav>
      <a href="/login">Login</a>
      <a style={{ marginLeft: "10px" }} href="/signup">
        Signup
      </a>
      {/* If account is logged in, render the logout button */}
      {loggedIn && <button onClick={() => Auth.logout()}>Logout</button>}
    </nav>
  );
};

export default NavBar;
