import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Button from "../UI/Button";
import ErrorModal from "../UI/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import Input from "../UI/Input";
import UserAvatar from "./ChangeAvatar";
import {
  VALIDATOR_OPTIONAL_MINLENGTH,
  VALIDATOR_OPTIONAL_HOURS,
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_OPTIONAL_DATE,
} from "../../Utility/validator";
import { useHttpClient } from "../../customHooks/http-hook";
import { useForm } from "../../customHooks/form-hook";
import { AuthContext } from "../context/auth-context";
import "./UserProfile.css";

const UserProfile = () => {
  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const userId = useParams().userId;


  const [formState, inputHandler, setFormData] = useForm(
    {
      name: { value: "", isValid: false },
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
      availableHours: { value: "", isValid: false },
      major: { value: "", isValid: false },
      graduationDate: { value: "", isValid: false },
    },
    false
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/user/${userId}`
        );
        setLoadedUser(responseData.user);
        setFormData(
          {
            name: { value: responseData.user.name, isValid: true },
            email: { value: responseData.user.email, isValid: true },
            password: { value: responseData.user.password, isValid: true },
            availableHours: {
              value: responseData.user.availableHours,
              isValid: true,
            },
            major: { value: responseData.user.major, isValid: true },
            graduationDate: {
              value: responseData.user.graduationDate,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchData();
  }, [sendRequest, userId, setFormData]);

  const saveChangesHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/user/${userId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
          availableHours: formState.inputs.availableHours.value,
          major: formState.inputs.major.value,
          graduationDate: formState.inputs.graduationDate.value,
        }),
        { "Content-Type": "application/json" }
      );
      history.push('/' + auth.userId + '/profile');
      //     setChangesMessage("Your changes were saved successfully!");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }


  return (
    <React.Fragment>
      <ErrorModal error={error} onclear={clearError} />
      {!isLoading && loadedUser && (
        <form className="profile-form" onSubmit={saveChangesHandler}>
          <UserAvatar size="80" name={loadedUser.name} />
          <h1>Profile Setting </h1>
          <hr />
          <Input
            id="name"
            element="input"
            type="text"
            label="Username"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid username."
            initialValue={loadedUser.name}
            onInput={inputHandler}
            initialValid={true}
          />
          <Input
            id="email"
            element="input"
            type="text"
            label="Email Address"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            initialValue={loadedUser.email}
            onInput={inputHandler}
            initialValid={true}
          />
               <Input
            id="password"
            element="input"
            type="text"
            label="Password"
            validators={[VALIDATOR_OPTIONAL_MINLENGTH(6)]}
            errorText="Please enter a new valid password, at least 6 characters."
            onInput={inputHandler}
            initialValid={true}
          />
          <Input
            id="availableHours"
            element="input"
            type="text"
            label="Available Hours"
            validators={[VALIDATOR_OPTIONAL_HOURS()]}
            errorText="Please enter valid hours from 0 - 23."
            initialValue={loadedUser.availableHours}
            onInput={inputHandler}
            initialValid={true}
          />
          <Input
            id="major"
            element="input"
            type="text"
            label="Major"
            validators={[VALIDATOR_OPTIONAL_MINLENGTH(1)]}
            errorText="Please enter a valid major."
            initialValue={loadedUser.major}
            onInput={inputHandler}
            initialValid={true}
          />
          <Input
            id="graduationDate"
            element="input"
            type="text"
            label="Graduation Date"
            validators={[VALIDATOR_OPTIONAL_DATE()]}
            errorText="Please enter a valid graduation date."
            initialValue={loadedUser.graduationDate}
            onInput={inputHandler}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Save changes
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
