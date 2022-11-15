import React from "react";
import Auth from "../utils/auth";

const NavBar = () => {
  //   const logout = (event) => {
  //     event.preventDefault();
  //     Auth.logout();
  //   };

  return (
    <nav>
      <a href="/login">Login</a>
      <a style={{ marginLeft: "10px" }} href="/signup">
        Signup
      </a>
    </nav>
  );
};

export default NavBar;
