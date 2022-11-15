import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import NavBar from "./components/NavBar";

import { setContext } from "@apollo/client/link/context";
import { useQuery } from "@apollo/client";
import { GET_USER } from "./utils/queries";

import Auth from "./utils/auth";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Check first if user is logged in, 'if (loggedIn) { then do this }'
let loggedIn =
  localStorage.getItem("id_token") == null
    ? false
    : localStorage.getItem("id_token") == "undefined"
    ? false
    : true;

// Returns logged in Users Data including Email, Username and AccountLevel
const getAccountLevel = () => {
  return Auth.getProfile();
};
if (loggedIn) {
  getAccountLevel();
}

function App() {
  loggedIn && console.log(getAccountLevel());
  return (
    <ApolloProvider client={client}>
      <NavBar loggedIn={loggedIn} />
      <Router>
        <>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            {/* User can only access About route (page) IF they are logged in */}
            {/* {loggedIn && <Route exact path="/about" component={About} />} */}
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
