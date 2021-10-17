import React, { useContext } from "react";
import {useHistory} from 'react-router-dom';

import Input from "../UI/Input";
import Button from "../UI/Button";
import { VALIDATOR_MINLENGTH , VALIDATOR_REQUIRE} from "../../Utility/validator";
import { useForm } from "../../customHooks/form-hook";
import ErrorModal from "../UI/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import {useHttpClient} from '../../customHooks/http-hook'
import { AuthContext } from "../context/auth-context";
import "./AddTask.css";

const AddTask = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    false
  );

  const history = useHistory();

  const taskSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:5000/tasks",
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          description: formState.inputs.description.value,
          creator: auth.userId,
        }),
        {'Content-Type': 'application/json'}
      );
      history.push('/' + auth.userId + '/tasks');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
    <form className="place-form" onSubmit={taskSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay/>}
      <Input
        id="name"
        element="input"
        type="text"
        label="Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid name."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD TASK
      </Button>
    </form>
    </React.Fragment>
  );
};


export default AddTask;