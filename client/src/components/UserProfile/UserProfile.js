import React, { useState, useEffect } from "react";

import Button from "../UI/Button";
import ErrorModal from "../UI/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../customHooks/http-hook";
import "./UserProfile.css";


const UserProfile = () => {
    const [loadedUser, setLoadedUser] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/user/${userId}`
                );
                setLoadedUser(responseData.user);
            } catch(err) {
                console.log(err);
            }
        };
        fetchData();
    }, [sendRequest, userId]);

    return (
        <React.Fragment>
        <ErrorModal error={error} onclear={clearError} />
        {isLoading && (
            <div className="center">
            <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedUser &&
        <form className="profile-form">
            <h1>Profile Setting</h1>
            <hr />
            <h3>User Name: {loadedUser.name}</h3>
            <h3>Email Address: {loadedUser.email}</h3>
            <h3>Password: ******</h3>
            <h3>Avaliable Hours: {loadedUser.avaliableHours ? loadedUser.avaliableHours : "Undecided"}</h3>
            <h3>Major: {loadedUser.major ? loadedUser.major : "Undecided"}</h3>
            <h3>Graduation Date: {loadedUser.graduationDate ? loadedUser.graduationDate : "Undecided"}</h3>
            <Button type="submit" >
                Edit
            </Button>
        </form>}
        </React.Fragment>
    )
};

export default UserProfile;