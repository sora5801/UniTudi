import React, {useContext } from "react";

import "./TaskItem.css";
import Card from "../../UI/Card";
import Button from "../../UI/Button";
import ErrorModal from "../../UI/ErrorModal";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../../customHooks/http-hook";

const isOverdue = (due) => {
  let today = new Date() + 1;
  return new Date(due.date) < today;
}

const TaskItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);


  const confirmCompleteHandler = async () => {
    try {
      await sendRequest(`http://18.117.141.174:5000/tasks/${props.id}`, "DELETE");
      props.onDelete(props.id);
    } catch (err) {}
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li className="task-item">
        <Card className="task-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="task-item__info">
            {isOverdue(props) ? <h3 style={{color:"red"}}> OVERDUE </h3> : ''
            }
            <h2>{props.name}</h2>
            <p>{props.description}</p>
            <p>Due date: {props.date}</p>
          </div>
          <div className="task-item__actions">
            {auth.userId === props.creatorId && (
              <Button to={`/tasks/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={confirmCompleteHandler}>
                COMPLETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
  
};

export default TaskItem;