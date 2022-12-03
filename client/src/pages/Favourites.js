import React, { useState, useEffect } from "react";

import { useQuery, useMutation } from "@apollo/client";

import Auth from "../utils/auth";

import { REMOVE_FAVOURITE } from "../utils/mutations";
import { GET_ME, GET_ADMIN } from "../utils/queries";

const Favourites = ({ account, accountLevel }) => {
  const [userState, setUserState] = useState();

  const FetchQuery = () => {
    var userData = useQuery(accountLevel == "Admin" ? GET_ADMIN : GET_ME, {
      variables: account ? { id: account.data._id } : { id: "blank" },
    });
    var user =
      accountLevel == "Admin"
        ? userData.data?.admin
        : userData.data?.get_me || [];
    return { userData, user };
  };

  let { user, userData } = FetchQuery();

  useEffect(() => {
    setUserState(user);
  }, [userData]);

  const [removeFavourite, { removeFavErr }] = useMutation(REMOVE_FAVOURITE);

  const removeFavouritePost = async (favouriteId) => {
    console.log(favouriteId, account.data._id);
    try {
      const user = await removeFavourite({
        variables: {
          favouriteId: favouriteId,
          userId: account.data._id,
        },
      });
      setUserState([
        ...userState.favouritedArr.filter(
          (dbPost) => dbPost._id !== user.data?.removeFavourite
        ),
      ]);
      return user;
    } catch (e) {
      // Clear state
      console.log(e);
    }
  };

  return (
    <div>
      {!userData.loading && user ? (
        user.favouritedArr.map((postId) => {
          return (
            <div style={{ display: "flex" }}>
              <p>{postId}</p>
              <button onClick={() => removeFavouritePost(postId)}>X</button>
            </div>
          );
        })
      ) : (
        <p>Loading posts...</p>
      )}
    </div>
  );
};

export default Favourites;
