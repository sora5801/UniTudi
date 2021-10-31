import React, { useState, useEffect } from "react";

import Button from "../UI/Button";
import ErrorModal from "../UI/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import Input from "../UI/Input";
import ChangeAvater from "./ChangeAvater";
import { VALIDATOR_OPTIONAL_MINLENGTH, VALIDATOR_OPTIONAL_HOURS, VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_OPTIONAL_DATE} from "../../Utility/validator";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../customHooks/http-hook";
import { useForm } from "../../customHooks/form-hook";
import "./UserProfile.css";

const UserProfile = () => {
    const [loadedUser, setLoadedUser] = useState();
    const [noChangesError, setNoChangesError] = useState();
    const [changesMessage, setChangesMessage] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;

    const clearNoChangesError = () => {
        setNoChangesError(null);
    };

    const clearChangesMessage = () => {
        setChangesMessage(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/users/${userId}`
                );
                setLoadedUser(responseData.user);
            } catch(err) {
                console.log(err);
            }
        };
        fetchData();
    }, [sendRequest, userId]);

    const [formState, inputHandler] = useForm(
        {
            username: { value: (!isLoading && loadedUser ? loadedUser.name : ''), isValid: !isLoading && loadedUser },
            email_address: { value: !isLoading && loadedUser ? loadedUser.email : '', isValid: !isLoading && loadedUser },
            password: { value: '', isValid: false },
            available_hours: { value: isLoading && loadedUser && loadedUser.availableHours ? loadedUser.availableHours : '', isValid: !isLoading && loadedUser },
            major: { value: isLoading && loadedUser && loadedUser.major ? loadedUser.major : '', isValid: !isLoading && loadedUser },
            graduation_date: { value: isLoading && loadedUser && loadedUser.graduationDate ? loadedUser.graduationDate : '', isValid: !isLoading && loadedUser }
        },
        false
    );

    const hadChanges = () => {
        return (
            (formState.inputs.username.isValid && formState.inputs.username.value !== loadedUser.name) ||
            (formState.inputs.email_address.isValid && formState.inputs.email_address.value !== loadedUser.email) ||
            (formState.inputs.password.isValid && formState.inputs.password.value !== '') ||
            (formState.inputs.available_hours.isValid && formState.inputs.available_hours.value !== '' && formState.inputs.available_hours.value !== formState.inputs.availableHours) ||
            (formState.inputs.major.isValid && formState.inputs.major.value !== '' && formState.inputs.major.value !== formState.inputs.major) ||
            (formState.inputs.graduation_date.isValid && formState.inputs.graduation_date.value !== '' && formState.inputs.graduation_date.value !== formState.inputs.graduationDate)
        );
    };

    const saveChangesHandler = async (event) => {
        event.preventDefault();

        if (!hadChanges()) {
            setNoChangesError("There are no changes, so the data cannot be saved!");
        } else {
            var userJSON = {};
            if (formState.inputs.username.isValid && formState.inputs.username.value !== loadedUser.name) {
                userJSON['name'] = formState.inputs.username.value;
            }
            if (formState.inputs.email_address.isValid && formState.inputs.email_address.value !== loadedUser.email) {
                userJSON['email'] = formState.inputs.username.value;
            }
            if (formState.inputs.password.isValid && formState.inputs.password.value !== '') {
                userJSON['password'] = formState.inputs.password.value;
            }
            if (formState.inputs.available_hours.isValid && formState.inputs.available_hours.value !== '' && formState.inputs.available_hours.value !== formState.inputs.availableHours) {
                userJSON['availableHours'] = formState.inputs.available_hours.value;
            }
            if (formState.inputs.major.isValid && formState.inputs.major.value !== '' && formState.inputs.major.value !== formState.inputs.major) {
                userJSON['major'] = formState.inputs.major.value;
            }
            if (formState.inputs.graduation_date.isValid && formState.inputs.graduation_date.value !== '' && formState.inputs.graduation_date.value !== formState.inputs.graduationDate) {
                userJSON['graduationDate'] = formState.inputs.graduation_date.value;
            }
            try {
                await sendRequest(
                    `http://localhost:5000/users/${userId}`,
                    "PATCH",
                    JSON.stringify(userJSON),
                    {"Content-Type": "application/json"}
                );
                setChangesMessage("Your changes were saved successfully!");
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <React.Fragment>
        <ErrorModal error={changesMessage} onClear={clearChangesMessage} />
        <ErrorModal error={noChangesError} onClear={clearNoChangesError} />
        <ErrorModal error={error} onclear={clearError} />
        {isLoading && (
            <div className="center">
            <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedUser &&
        <form className="profile-form" onSubmit={saveChangesHandler} >
            <ChangeAvater size="80" name={loadedUser.name} />
            <h1>Profile Setting </h1>
            <hr />
            <Input
                id="username"
                element="input"
                type="text"
                label="Username"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid username."
                initialValue={loadedUser.name}
                onInput={inputHandler}
            />
            <Input
                id="email_address"
                element="input"
                type="text"
                label="Email Address"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email."
                initialValue={loadedUser.email}
                onInput={inputHandler}
            />
            <Input
                id="password"
                element="input"
                type="text"
                label="Password"
                validators={[VALIDATOR_OPTIONAL_MINLENGTH(6)]}
                errorText="Please enter a new valid password, at least 6 characters."
                onInput={inputHandler}
            />
            <Input
                id="available_hours"
                element="input"
                type="text"
                label="Available Hours"
                validators={[VALIDATOR_OPTIONAL_HOURS()]}
                errorText="Please enter valid hours from 0 - 23."
                initialValue={loadedUser.availableHours ? loadedUser.availableHours : ''}
                onInput={inputHandler}
            />
            <Input
                id="major"
                element="input"
                type="text"
                label="Major"
                validators={[VALIDATOR_OPTIONAL_MINLENGTH(1)]}
                errorText="Please enter a valid major."
                initialValue={loadedUser.major ? loadedUser.major : ''}
                onInput={inputHandler}
            />
            <Input
                id="graduation_date"
                element="input"
                type="text"
                label="Graduation Date"
                validators={[VALIDATOR_OPTIONAL_DATE()]}
                errorText="Please enter a valid graduation date."
                initialValue={loadedUser.graduationDate ? loadedUser.graduationDate : ''}
                onInput={inputHandler}
            />
            <Button type="submit" >Save changes</Button>
        </form>}
        </React.Fragment>
    )
};

export default UserProfile;