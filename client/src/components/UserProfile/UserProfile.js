import React, { useState, useEffect } from "react";

import Button from "../UI/Button";
import ErrorModal from "../UI/ErrorModal";
import SuccessModal from "../UI/SuccessModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import Input from "../UI/Input";
import Select from "../UI/Select";
import ChangeAvatar from "./ChangeAvatar";
import { VALIDATOR_OPTIONAL_MINLENGTH, VALIDATOR_OPTIONAL_HOURS, VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_OPTIONAL_DATE} from "../../Utility/validator";
import { validMajors } from "../../Utility/valid-majors";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../customHooks/http-hook";
import { useForm } from "../../customHooks/form-hook";
import "./UserProfile.css";

const UserProfile = () => {
    const [loadedUser, setLoadedUser] = useState();
    const [changesMessage, setChangesMessage] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;

    const clearChangesMessage = () => {
        setChangesMessage(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/users/${userId}`
                );
                responseData.user.graduationDate = (new Date(Date.parse(responseData.user.graduationDate))).toLocaleString('en-US', { day: "2-digit", month: "2-digit", year: "2-digit" });
                setLoadedUser(responseData.user);
            } catch(err) {
                console.log(err);
            }
        };
        fetchData();
    }, [sendRequest, userId]);

    const [formState, inputHandler, selectHandler] = useForm(
        {
            username: { value: (!isLoading && loadedUser ? loadedUser.name : ''), isValid: !isLoading && loadedUser },
            email_address: { value: !isLoading && loadedUser ? loadedUser.email : '', isValid: !isLoading && loadedUser },
            password: { value: '', isValid: false },
            available_hours: { value: isLoading && loadedUser && loadedUser.availableHours ? loadedUser.availableHours : '', isValid: !isLoading && loadedUser },
            major: { value: isLoading && loadedUser && loadedUser.major ? loadedUser.major : '', isValid: true },
            graduation_date: { value: isLoading && loadedUser && loadedUser.graduationDate ? loadedUser.graduationDate : '', isValid: !isLoading && loadedUser }
        },
        false
    );

    const hadChanges = () => {
        return (
            (formState.inputs.username.isValid && formState.inputs.username.value !== loadedUser.name) ||
            (formState.inputs.email_address.isValid && formState.inputs.email_address.value !== loadedUser.email) ||
            (formState.inputs.password.isValid && formState.inputs.password.value !== '') ||
            (formState.inputs.available_hours.isValid && formState.inputs.available_hours.value !== '' && formState.inputs.available_hours.value !== loadedUser.availableHours) ||
            (formState.inputs.major.isValid && formState.inputs.major.value !== 'Select a major' && formState.inputs.major.value !== loadedUser.major) ||
            (formState.inputs.graduation_date.isValid && formState.inputs.graduation_date.value !== '' && formState.inputs.graduation_date.value !== loadedUser.graduationDate)
        );
    };

    const saveChangesHandler = async (event) => {
        event.preventDefault();

        var userJSON = {};
        if (formState.inputs.username.isValid && formState.inputs.username.value !== loadedUser.name) {
            userJSON['name'] = formState.inputs.username.value;
            loadedUser.name = formState.inputs.username.value;
        }
        if (formState.inputs.email_address.isValid && formState.inputs.email_address.value !== loadedUser.email) {
            userJSON['email'] = formState.inputs.email_address.value;
            loadedUser.email = formState.inputs.email_address.value;
        }
        if (formState.inputs.password.isValid && formState.inputs.password.value !== '') {
            userJSON['password'] = formState.inputs.password.value;
        }
        if (formState.inputs.available_hours.isValid && formState.inputs.available_hours.value !== '' && formState.inputs.available_hours.value !== loadedUser.availableHours) {
            userJSON['availableHours'] = formState.inputs.available_hours.value;
            loadedUser.availableHours = formState.inputs.available_hours.value;
        }
        if (formState.inputs.major.isValid && formState.inputs.major.value !== 'Select a major' && formState.inputs.major.value !== loadedUser.major) {
            userJSON['major'] = formState.inputs.major.value;
            loadedUser.major = formState.inputs.major.value;
        }
        if (formState.inputs.graduation_date.isValid && formState.inputs.graduation_date.value !== '' && formState.inputs.graduation_date.value !== loadedUser.graduationDate) {
            userJSON['graduationDate'] = formState.inputs.graduation_date.value;
            loadedUser.graduationDate = formState.inputs.graduation_date.value;
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
    };

    return (
        <React.Fragment>
        <SuccessModal message={changesMessage} onClear={clearChangesMessage} />
        <ErrorModal error={error} onclear={clearError} />
        {isLoading && (
            <div className="center">
            <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedUser &&
        <form className="profile-form" onSubmit={saveChangesHandler} >
            <ChangeAvatar size="80" name={loadedUser.name} />
            <h1>Profile Setting </h1>
            <hr />
            <Input
                id="username"
                element="input"
                type="text"
                label="Username"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid username."
                placeholder="Enter your name here."
                initialValue={loadedUser.name}
                initialValid={true}
                onInput={inputHandler}
            />
            <Input
                id="email_address"
                element="input"
                type="text"
                label="Email Address"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email."
                placeholder="Enter your email here."
                initialValue={loadedUser.email}
                initialValid={true}
                onInput={inputHandler}
            />
            <Input
                id="password"
                element="input"
                type="text"
                label="Password"
                validators={[VALIDATOR_OPTIONAL_MINLENGTH(6)]}
                errorText="Please enter a new valid password, at least 6 characters."
                placeholder="Enter your password here."
                initialValid={true}
                onInput={inputHandler}
            />
            <Input
                id="available_hours"
                element="input"
                type="text"
                label="Available Hours"
                validators={[VALIDATOR_OPTIONAL_HOURS()]}
                errorText="Please enter valid hours from 0 - 23."
                placeholder="Enter your available hours here."
                initialValue={loadedUser.availableHours ? loadedUser.availableHours : ''}
                initialValid={true}
                onInput={inputHandler}
            />
            <Select
                id="major"
                label="Major"
                validValues={validMajors}
                initialValue={loadedUser.major ? loadedUser.major : validMajors[0].name}
                onSelect={selectHandler}
            />
            <Input
                id="graduation_date"
                element="input"
                type="text"
                label="Graduation Date"
                validators={[VALIDATOR_OPTIONAL_DATE()]}
                errorText="Please enter a valid graduation date."
                placeholder="Enter your graduation date here."
                initialValue={loadedUser.graduationDate ? loadedUser.graduationDate : ''}
                initialValid={true}
                onInput={inputHandler}
            />
            <Button type="submit" disabled={!hadChanges()} >Save changes</Button>
        </form>}
        </React.Fragment>
    )
};

export default UserProfile;