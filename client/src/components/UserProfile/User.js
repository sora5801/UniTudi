import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Button from "../UI/Button";
import ErrorModal from "../UI/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import UserAvatar from "./ChangeAvatar";

import { useHttpClient } from "../../customHooks/http-hook";
import "./User.css";


const User = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [loadedUser, setLoadedUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
            `http://localhost:5000/user/${userId}`
        );
        
        setLoadedUser(responseData.user);
        
      } catch (err) {}
    };
    fetchData();
  }, [sendRequest, userId]);
  console.log(userId);

  


  return (
    <React.Fragment>
        <ErrorModal error={error} onclear={clearError} />
        {!isLoading && loadedUser && (
      <li className="task-item">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="profile-form">
          <UserAvatar size="80" name={loadedUser.name} />
          <h1>Profile Setting</h1>
            <hr />
            <h3>User Name: {loadedUser.name}</h3>
            <h3>Email Address: {loadedUser.email}</h3>
            <h3>Password: ******</h3>
            <h3>Avaliable Hours: {loadedUser.availableHours}</h3>
            <h3>Major: {loadedUser.major}</h3>
            <h3>Graduation Date: {loadedUser.graduationDate}</h3>
            <div className="profile-item__actions">
              <Button to={`/${userId}/edit`}>EDIT</Button>
          </div>
          </div>
      </li>)}
    </React.Fragment>
  );
  
};

export default User;