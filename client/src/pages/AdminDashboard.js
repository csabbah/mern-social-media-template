import React, { useState, useEffect } from "react";

import { useMutation, useQuery } from "@apollo/client";

import {
  ADD_ADMIN,
  REMOVE_ADMIN,
  ADD_MASTER,
  ADD_QUOTE,
  ADD_FACT,
} from "../utils/mutations";
import { GET_ADMINS, GET_MASTERS } from "../utils/queries";

import Auth from "../utils/auth";

const AdminDashboard = () => {
  const [addQuote, { quotesErr }] = useMutation(ADD_QUOTE);
  const [addFact, { factsErr }] = useMutation(ADD_FACT);
  const [addMaster] = useMutation(ADD_MASTER);
  const [addAdmin, { error }] = useMutation(ADD_ADMIN);

  const [removeAdmin] = useMutation(REMOVE_ADMIN);
  const [errorMessage, setErrorMessage] = useState("");
  const [update, setUpdate] = useState("");

  const QueryMultiple = () => {
    const masters = useQuery(GET_MASTERS);
    const admins = useQuery(GET_ADMINS);
    return { masters, admins };
  };
  const { masters, admins } = QueryMultiple();
  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (
      e.target.adminEmail.value &&
      e.target.adminName.value &&
      e.target.adminPass.value
    ) {
      try {
        await addAdmin({
          variables: {
            username: e.target.adminName.value,
            password: e.target.adminPass.value,
            email: e.target.adminEmail.value,
          },
        });
        document.querySelector(".adminForm").reset();
        setUpdate("Admin added!");

        setTimeout(() => {
          setUpdate("");
        }, 2500);
      } catch (e) {
        // Clear state
        console.log(e);
      }
    } else {
      setErrorMessage("Please fill in all fields");
    }
  };

  const deleteAdmin = async (id) => {
    try {
      await removeAdmin({
        variables: {
          id: id,
        },
      });
      setUpdate("Admin removed!");
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addMasterModel = async (e) => {
    e.preventDefault();

    try {
      await addMaster();
      setUpdate("Master Added!");
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addQuoteToMaster = async (e) => {
    e.preventDefault();

    try {
      await addQuote({
        variables: {
          masterId: masters.data.masters[0]._id,
          author: e.target.author.value,
          text: e.target.text.value,
        },
      });
      setUpdate("Quote added to master!");
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const addFactToMaster = async (e) => {
    e.preventDefault();

    try {
      await addFact({
        variables: {
          masterId: masters.data.masters[0]._id,
          genre: e.target.genre.value,
          text: e.target.text.value,
        },
      });
      setUpdate("Fact added to master!");
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  return (
    <div>
      {/* Create an Admin Model */}
      <form
        style={{ marginTop: "50px" }}
        className="adminForm"
        onSubmit={(e) => handleUserSubmit(e)}
      >
        <h5>Add new Admin</h5>
        <label htmlFor="adminEmail">Email</label>
        <input
          id="adminEmail"
          onChange={(e) => {
            setErrorMessage("");
          }}
          name="adminEmail"
          type="text"
          placeholder="Email Address"
        ></input>
        <label htmlFor="adminName">Username</label>
        <input
          id="adminName"
          onChange={(e) => {
            setErrorMessage("");
          }}
          name="adminName"
          type="text"
          placeholder="Username"
        ></input>
        <label htmlFor="adminPass">Password</label>
        <input
          id="adminPass"
          onChange={(e) => {
            setErrorMessage("");
          }}
          name="adminPass"
          type="password"
          placeholder="Password"
        ></input>
        <button type="submit">Sign Up</button>
        {update && <p>{update}</p>}
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {error && (
          <p>
            Failed to Signup. Possible Reason: Email or Username already exists
          </p>
        )}
      </form>
      {/* Returns active Admins */}
      {!admins.loading && (
        <ul style={{ marginTop: "15px" }}>
          <h5>Active Admins</h5>
          {admins.data.admins.map((admin, i) => {
            return (
              <li key={i}>
                {admin.email}
                <button onClick={() => deleteAdmin(admin._id)}>X</button>
              </li>
            );
          })}
        </ul>
      )}
      {/* Create a Masters model */}
      <form style={{ marginTop: "50px" }} onSubmit={(e) => addMasterModel(e)}>
        <h5>Add master</h5>
        <button>Add</button>
      </form>
      {/* Manually add a Quote to the Master model */}
      <form style={{ marginTop: "50px" }} onSubmit={(e) => addQuoteToMaster(e)}>
        <h5>Add new Quote to master</h5>
        <label htmlFor="quote Text">quote Text</label>
        <input id="quote Text" name="text" placeholder="Quote Text"></input>
        <label htmlFor="quote Author">quote Author</label>
        <input
          id="quote Author"
          name="author"
          placeholder="Quote Author"
        ></input>
        <button>Add</button>
      </form>
      {/* Returns active Quotes */}
      {!masters.loading && (
        <ul style={{ marginTop: "15px" }}>
          <h5>Active Quotes</h5>
          {masters.data.masters[0].quotesArr.map((quote, i) => {
            return (
              <li key={i}>
                {quote.text} {quote.author && quote.author}
              </li>
            );
          })}
        </ul>
      )}
      <form style={{ marginTop: "50px" }} onSubmit={(e) => addFactToMaster(e)}>
        <h5>Add new Fact to master</h5>
        <label htmlFor="Fact Text">Fact Text</label>
        <input id="Fact Text" name="text" placeholder="Fact Text"></input>
        <label htmlFor="Fact Genre">Fact Genre</label>
        <input id="Fact Genre" name="genre" placeholder="Fact Genre"></input>
        <button>Add</button>
      </form>
      {/* Returns active Facts */}
      {!masters.loading && (
        <ul style={{ marginTop: "15px" }}>
          <h5>Active Facts</h5>
          {masters.data.masters[0].factsArr.map((fact, i) => {
            return (
              <li key={i}>
                {fact.text} {fact.genre && fact.genre}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
