import React from "react";
import Auth from "../utils/auth";

const NavBar = ({ loggedIn, accountLevel }) => {
  const pathname = window.location.pathname;

  console.log(pathname);
  return (
    <nav>
      <p>Devlp</p>
      <a className={`nav ${pathname == "/" && "active"}`} href="/">
        Home
      </a>
      {accountLevel == "Admin" && (
        <a
          className={`nav ${pathname == "/admin-dashboard" && "active"}`}
          href="/admin-dashboard"
        >
          Admin Dashboard
        </a>
      )}
      {!loggedIn && (
        <>
          <a
            className={`nav ${pathname == "/login" && "active"}`}
            href="/login"
          >
            Login
          </a>
          <a
            className={`nav ${pathname == "/signup" && "active"}`}
            href="/signup"
          >
            Signup
          </a>
        </>
      )}

      {/* If account is logged in, render the logout button */}
      {loggedIn && <button onClick={() => Auth.logout()}>Logout</button>}
    </nav>
  );
};

export default NavBar;
