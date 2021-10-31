import React, { useState, useContext } from "react";

import "./TaskItem.css";
import Card from "../../UI/Card";
import Button from "../../UI/Button";
import Modal from "../../UI/Modal";
import ErrorModal from "../../UI/ErrorModal";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../../customHooks/http-hook";
import moment from 'moment';

const TaskItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isOverdue = () => {
   return moment(props.date).isBefore();
  }

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`http://localhost:5000/tasks/${props.id}`, "DELETE");
      props.onDelete(props.id);
    } catch (err) {}
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="task-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this task?</p>
      </Modal>
      <li className="task-item">
        <Card className="task-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="task-item__info">
            {isOverdue() ? <h3 style={{color:"red"}}> OVERDUE </h3> : ''
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
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
  
};

export default TaskItem;
