import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../UI/Input';
import Button from '../UI/Button';
import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorModal from '../UI/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_DATE} from '../../Utility/validator';
import { useForm } from '../../customHooks/form-hook';
import { useHttpClient } from '../../customHooks/http-hook';
import { AuthContext } from '../context/auth-context';
import './AddTask.css';

const UpdateTask = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTask, setLoadedTask] = useState();
  const taskId = useParams().taskId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      date: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/tasks/${taskId}`
        );
        setLoadedTask(responseData.task);
        setFormData(
          {
            name: {
              value: responseData.task.name,
              isValid: true
            },
            description: {
              value: responseData.task.description,
              isValid: true
            },
            date: {
              value: responseData.task.date,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, taskId, setFormData]);

  const taskUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/tasks/${taskId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          description: formState.inputs.description.value,
          date: formState.inputs.date.value
        }),
        {
          'Content-Type': 'application/json',
      //    Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/' + auth.userId + '/tasks');
    } catch (err) {}
  };

  const hadChanges = () => {
    return (
        (formState.inputs.name.isValid && formState.inputs.name.value !== loadedTask.name) ||
        (formState.inputs.description.isValid && formState.inputs.description.value !== loadedTask.description) ||
       (formState.inputs.date.isValid && formState.inputs.date.value !== loadedTask.date) 
    );
};

  const cancelChangesHandler = () => {
    history.push("/" + auth.userId + "/tasks");
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedTask && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find task!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedTask && (
        <form className="place-form" onSubmit={taskUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedTask.name}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedTask.description}
            initialValid={true}
          />
          <Input
        id="date"
        element="input"
        type="text"
        label="Due Date"
        validators={[VALIDATOR_DATE()]}
        errorText="Please enter a valid date (Format is MM/DD/YY and must be after today's date)."
        onInput={inputHandler}
        initialValue={loadedTask.date}
            initialValid={true}
      />
          <Button type="submit" disabled={!hadChanges()}>
            UPDATE TASK
          </Button>
          <Button inverse onClick={cancelChangesHandler}>
                Cancel changes
              </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateTask;