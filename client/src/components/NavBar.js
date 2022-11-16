import React from "react";
import Auth from "../utils/auth";

const NavBar = ({ loggedIn, accountLevel }) => {
  return (
    <nav>
      {accountLevel == "Admin" && (
        <a href="/admin-dashboard">Admin Dashboard</a>
      )}
      {!loggedIn && (
        <>
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
        </>
      )}

      {/* If account is logged in, render the logout button */}
      {loggedIn && <button onClick={() => Auth.logout()}>Logout</button>}
    </nav>
  );
};

export default NavBar;
