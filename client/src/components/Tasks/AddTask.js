import React, { useState, useContext } from "react";
import {useHistory} from 'react-router-dom';

import Input from "../UI/Input";
import Button from "../UI/Button";
import { VALIDATOR_MINLENGTH , VALIDATOR_REQUIRE, VALIDATOR_DATE} from "../../Utility/validator";
import { useForm } from "../../customHooks/form-hook";
import ErrorModal from "../UI/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import {useHttpClient} from '../../customHooks/http-hook'
import { AuthContext } from "../context/auth-context";
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import "./AddTask.css";

const AddTask = () => {
  const [date, setDate] = useState(new Date());
  const current = moment().format("MMM Do YY"); 

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: { value: "", isValid: false },
      description: { value: "", isValid: false },
      date: {value: date, isValid: true}
    },
    false
  );

  const history = useHistory();

  const taskSubmitHandler = async (event) => {
    event.preventDefault();
    try {
   //   const formData = new FormData(); 
   //   formData.append('name', formState.inputs.name.value);
   //   formData.append('description', formState.inputs.description.value);
    //  formData.append('date', formState.inputs.date.value);
    //  formData.append('creator', auth.userId);
      await sendRequest(
        "http://3.14.141.124:5000/tasks",
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          description: formState.inputs.description.value,
          date: formState.inputs.date.value,
          creator: auth.userId,
        }),
        {'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token}
      );
      history.push('/' + auth.userId + '/tasks');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
    
    <div class = "center">
      <Calendar onChange={setDate}
      value={date} />
      </div>
    
    <form className="task-form" onSubmit={taskSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay/>}
      <h3 >Today is {current} </h3>
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
       <Input
        id="date"
        element="input"
        type="text"
        label="Due Date(MM/DD/YY)"
        validators={[VALIDATOR_DATE()]}
        errorText="Please enter a valid date (Format is MM/DD/YY and must be on or after today's date)."
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