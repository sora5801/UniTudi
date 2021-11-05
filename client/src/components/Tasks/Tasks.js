import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


import TaskList from "./components/TaskList";
import ErrorModal from "../UI/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useHttpClient } from "../../customHooks/http-hook";


const Tasks = () => {
  const [loadedTasks, setLoadedTasks] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/tasks/user/${userId}`
        );
        setLoadedTasks(responseData.tasks);
      } catch (err) {}
    };
    fetchTasks();
  }, [sendRequest, userId]);

  const taskDeletedHandler = (deletedTaskId) => {
    setLoadedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== deletedTaskId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedTasks && (
        <TaskList items={loadedTasks} onDeleteTask={taskDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default Tasks;
