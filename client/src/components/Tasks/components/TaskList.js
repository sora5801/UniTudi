import React from "react";

import Card from "../../UI/Card";
import TaskItem from "./TaskItem";
import Button from "../../UI/Button";
import {useHistory, useLocation, useParams} from 'react-router-dom';
import moment from 'moment';
import classes from "./TaskList.module.css";

const sortTasks = (tasks, ascending) => {
  return tasks.sort((taskA, taskB) => {
      if(ascending){
        return moment(taskA.date).isAfter(moment(taskB.date)) ? 1 : -1;
      } else {
        return moment(taskA.date).isBefore(moment(taskB.date)) ? 1 : -1;
      }
  });
}

const TaskList = (props) => {
  const userId = useParams().userId;

  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const isSortingAscending = queryParams.get("sort") === "asc";

  const sortedTasks = sortTasks(props.items, isSortingAscending);

  const changeSortingHandler = () => {
    history.push(`/${userId}/tasks?sort=` + (isSortingAscending ? 'desc': 'asc'));
  };

  if (props.items.length === 0) {
    return (
      <div className={classes.list}>
        <Card>
          <h2>No tasks found. Maybe create one?</h2>
          <Button to ="/tasks/new">Add Task</Button>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
   <div className={classes.sorting}>
        <button onClick={changeSortingHandler}>
          Sort {isSortingAscending ? "Descending" : "Ascending"}
        </button>
        </div>
    <ul className={classes.list}>
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          name={task.name}
          description={task.description}
          date={task.date}
          creatorId={task.creator}
          onDelete={props.onDeleteTask}
        />
      ))}
    </ul>
    </React.Fragment>
  );
};

export default TaskList;
