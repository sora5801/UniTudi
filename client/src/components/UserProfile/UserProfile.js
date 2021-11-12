import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Button from "../UI/Button";
import ErrorModal from "../UI/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import Input from "../UI/Input";
import UserAvatar from "./ChangeAvatar";
import { //validate,
  VALIDATOR_OPTIONAL_MINLENGTH,
  VALIDATOR_OPTIONAL_HOURS,
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_OPTIONAL_DATE,
} from "../../Utility/validator";
import { useHttpClient } from "../../customHooks/http-hook";
import { useForm } from "../../customHooks/form-hook";
import { AuthContext } from "../context/auth-context";
import Select from "../UI/Select";
import { validMajors } from "../../Utility/valid-majors";
import "./UserProfile.css";

const UserProfile = () => {
  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const userId = useParams().userId;

  const [formState, inputHandler, selectHandler, setFormData] = useForm(
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
          `http://3.14.141.124:5000/user/${userId}`
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

  const saveChangesHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://3.14.141.124:5000/user/${userId}`,
        "PATCH",
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
      history.push("/" + auth.userId + "/profile");
    } catch (err) {}
  };

  const cancelChangesHandler = () => {
    history.push("/" + auth.userId + "/profile");
  }

  const hadChanges = () => {
    return (
        (formState.inputs.name.isValid && formState.inputs.name.value !== loadedUser.name) ||
        (formState.inputs.email.isValid && formState.inputs.email.value !== loadedUser.email) ||
       (formState.inputs.password.isValid && formState.inputs.password.value !== '') ||
        (formState.inputs.availableHours.isValid && formState.inputs.availableHours.value !== '' && formState.inputs.availableHours.value !== loadedUser.availableHours) ||
        (formState.inputs.major.isValid && formState.inputs.major.value !== 'Select a major' && formState.inputs.major.value !== loadedUser.major) ||
        (formState.inputs.graduationDate.isValid && formState.inputs.graduationDate.value !== '' 
        && formState.inputs.graduationDate.value !==(new Date(Date.parse(loadedUser.graduationDate))).toLocaleString('en-US', { day: "2-digit", month: "2-digit", year: "2-digit" }))
    );
};

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  /*
  Testing the validator approaches because I am a very petty person.
  var iterations = 1000000;
  console.time('Function validate with VALIDATOR_OPTIONAL HOURS');
  for(var i = 0; i < iterations; i++ ){
   validate(formState.inputs.availableHours, [VALIDATOR_OPTIONAL_HOURS]);
};
console.timeEnd('Function validate with VALIDATOR_OPTIONAL HOURS')
console.time('Function validate with VALIDATOR_REQUIRE');
  for(var i = 0; i < iterations; i++ ){
    validate(formState.inputs.name, [VALIDATOR_REQUIRE]);
};
console.timeEnd('Function validate with VALIDATOR_REQUIRE')
console.time('Function validate with VALIDATOR_EMAIL');
  for(var i = 0; i < iterations; i++ ){
    validate(formState.inputs.email, [VALIDATOR_EMAIL]);
};
console.timeEnd('Function validate with VALIDATOR_EMAIL')
*/

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
        element="input"
        id="email"
        type="email"
        label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            initialValue={loadedUser.email}
            onInput={inputHandler}
            initialValid={true}
          />
          <Input
             element="input"
             id="password"
             type="password"
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
          <Select
            id="major"
            label="Major"
            validValues={validMajors}
            initialValue={loadedUser.major}
            onSelect={selectHandler}
          />
          <Input
            id="graduationDate"
            element="input"
            type="text"
            label="Graduation Date"
            validators={[VALIDATOR_OPTIONAL_DATE()]}
            errorText="Please enter a valid graduation date."
            initialValue={(new Date(Date.parse(loadedUser.graduationDate))).toLocaleString('en-US', { day: "2-digit", month: "2-digit", year: "2-digit" })}
            onInput={inputHandler}
            initialValid={true}
          />
          <Button type="submit" disabled={!hadChanges()}>
            Save changes
          </Button>
          <Button inverse onClick={cancelChangesHandler}>
                Cancel changes
              </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UserProfile;