import React, { useState, useEffect } from "react";

import { useMutation, useQuery } from "@apollo/client";

import {
  ADD_ADMIN,
  REMOVE_ADMIN,
  ADD_MASTER,
  ADD_QUOTE,
  ADD_FACT,
  ADD_VOCAB,
  ADD_GEO,
  REMOVE_GEO,
} from "../utils/mutations";
import { GET_ADMINS, GET_MASTERS } from "../utils/queries";

import Auth from "../utils/auth";

const AdminDashboard = () => {
  const [addQuote, { quotesErr }] = useMutation(ADD_QUOTE);
  const [addFact, { factsErr }] = useMutation(ADD_FACT);
  const [addVocab, { vocabErr }] = useMutation(ADD_VOCAB);
  const [addGeo, { geoErr }] = useMutation(ADD_GEO);
  const [removeGeo, { removeGeoErr }] = useMutation(REMOVE_GEO);

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

  const addDataToMaster = async (e) => {
    e.preventDefault();

    try {
      if (e.target.name == "Geography") {
        await addGeo({
          variables: {
            masterId: masters.data.masters[0]._id,
            country: e.target.country.value,
            flag: e.target.flag.value,
            continent: e.target.continent.value,
            phoneCode: e.target.phoneCode.value,
            capital: e.target.capital.value,
          },
        });
      }
      if (e.target.name == "Vocabulary") {
        await addVocab({
          variables: {
            masterId: masters.data.masters[0]._id,
            text: e.target.text.value,
            definition: e.target.definition.value,
            typeOfSpeech: e.target.typeOfSpeech.value,
          },
        });
      }

      if (e.target.name == "Fact") {
        await addFact({
          variables: {
            masterId: masters.data.masters[0]._id,
            genre: e.target.genre.value,
            text: e.target.text.value,
          },
        });
      }

      if (e.target.name == "Quote") {
        await addQuote({
          variables: {
            masterId: masters.data.masters[0]._id,
            author: e.target.author.value,
            text: e.target.text.value,
          },
        });
      }

      setUpdate(`${e.target.name} added to master!`);
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  const removeFromMaster = async (id) => {
    try {
      await removeGeo({
        variables: {
          masterId: masters.data.masters[0]._id,
          geoId: id,
        },
      });

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
      <form
        name="Quote"
        style={{ marginTop: "50px" }}
        onSubmit={(e) => addDataToMaster(e)}
      >
        <h5>Add new Quote to master</h5>
        <label htmlFor="quoteText">quote Text</label>
        <input
          id="quoteText"
          name="text"
          placeholder="This too shall pass"
        ></input>
        <label htmlFor="quoteAuthor">quote Author</label>
        <input
          id="quoteAuthor"
          name="author"
          placeholder="Theodore Roosevelt"
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
                <button onClick={() => console.log(quote._id)}>X</button>
              </li>
            );
          })}
        </ul>
      )}
      {/* Manually add a Fact to the Master model */}
      <form
        name="Fact"
        style={{ marginTop: "50px" }}
        onSubmit={(e) => addDataToMaster(e)}
      >
        <h5>Add new Fact to master</h5>
        <label htmlFor="FactText">Fact Text</label>
        <input id="FactText" name="text" placeholder="The sun is big"></input>
        <label htmlFor="FactGenre">Astromony</label>
        <input id="FactGenre" name="genre" placeholder="Astronomy"></input>
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
                <button onClick={() => console.log(fact._id)}>X</button>
              </li>
            );
          })}
        </ul>
      )}
      {/* Manually add a Vocab to the Master model */}
      <form
        name="Vocabulary"
        style={{ marginTop: "50px" }}
        onSubmit={(e) => addDataToMaster(e)}
      >
        <h5>Add new Vocab to master</h5>
        <label htmlFor="VocabWord">Word</label>
        <input id="VocabWord" name="text" placeholder="Box"></input>
        <label htmlFor="VocabDefinition">Definition</label>
        <input
          id="VocabDefinition"
          name="definition"
          placeholder="To open an object"
        ></input>
        <label htmlFor="VocabtypeOfSpeech">Type of Speech</label>
        <input
          id="VocabtypeOfSpeech"
          name="typeOfSpeech"
          placeholder="Noun"
        ></input>
        <button>Add</button>
      </form>
      {/* Returns active Vocab */}
      {!masters.loading && (
        <ul style={{ marginTop: "15px" }}>
          <h5>Active Vocabulary</h5>
          {masters.data.masters[0].vocabArr.map((vocab, i) => {
            return (
              <li key={i}>
                {vocab.text} {vocab.definition} {vocab.typeOfSpeech}
                <button onClick={() => console.log(vocab._id)}>X</button>
              </li>
            );
          })}
        </ul>
      )}
      {/* Manually add Geography to the Master model */}
      <form
        name="Geography"
        style={{ marginTop: "50px" }}
        onSubmit={(e) => addDataToMaster(e)}
      >
        <h5>Add new Geography to master</h5>
        <label htmlFor="country">Country</label>
        <input id="country" name="text" placeholder="Canada"></input>
        <label htmlFor="flag">flag</label>
        <input id="flag" name="flag" placeholder="Image"></input>
        <label htmlFor="continent">Continent</label>
        <input
          id="continent"
          name="continent"
          placeholder="North America"
        ></input>
        <label htmlFor="phoneCode">Phone Code</label>
        <input id="phoneCode" name="phoneCode" placeholder="+1"></input>
        <label htmlFor="capital">Capital</label>
        <input id="capital" name="capital" placeholder="Ottawa"></input>
        <button>Add</button>
      </form>
      {/* Returns active Geography */}
      {!masters.loading && (
        <ul style={{ marginTop: "15px" }}>
          <h5>Active Geography</h5>
          {masters.data.masters[0].geoArr.map((geo, i) => {
            return (
              <li key={i}>
                {geo.country} {geo.capital} {geo.continent} {geo.phoneCode}
                {geo.flag}
                <button onClick={() => removeFromMaster(geo._id)}>X</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
