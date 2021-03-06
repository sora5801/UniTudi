import React, {useState} from "react";

import Card from "../../UI/Card";
import TaskItem from "./TaskItem";
import Button from "../../UI/Button";
import Modal from "../../UI/Modal";
import {useHistory, useLocation} from 'react-router-dom';
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

const reminder = (tasks) => {
  return tasks.filter((due) => moment(due.date).isSame(moment(), 'day'))
}

const displayTasks = (tasks, display) => {
  return tasks.filter((due) => {
    if(display){
      return moment(due.date).isAfter(moment(), 'day')
    } else {
        return true;
    }
  })
}

const TaskList = (props) => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [displayAllTasks, setDisplayAllTasks] = useState(false);


  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const isSortingAscending = queryParams.get("sort") === "asc";

  const isAllTasks = queryParams.get("task") === "all";

  const sortedTasks = sortTasks(props.items, isSortingAscending);

  const allTasks = displayTasks(props.items, isAllTasks);

  const changeSortingHandler = () => {
    setDisplayAllTasks(false);
    history.push({
      pathname: location.pathname,
      search: `?sort=${(isSortingAscending ? 'desc': 'asc')}`
    })
  };    

  const changeTasksHandler = () => {
    setDisplayAllTasks(true);
    history.push({
      pathname: location.pathname, 
      search: `?task=${(isAllTasks ? 'Upcoming': 'all')}`
    })
  }

  const showReminderHandler = () => {
    setShowReminderModal(true);
  }

  const cancelReminderHandler = () => {
    setShowReminderModal(false);
  }

  const reminderHandler = reminder(props.items);

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
       <Modal
        show={showReminderModal}
        onCancel={cancelReminderHandler}
        header="Reminders"
        footerClass="task-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelReminderHandler}>
              OKAY
            </Button>
          </React.Fragment>
        }
      >
      {reminderHandler.length > 0 ? <p>Tasks due today: {reminderHandler.map((task => (task.name + ', ')))}</p> : <p>No Tasks due today</p> }
      </Modal>
   <div className={classes.sorting}>
        <button onClick={changeSortingHandler}>
          Sort {isSortingAscending ? "Descending" : "Ascending"}
        </button>
        <button onClick={showReminderHandler}>
          Reminders
        </button>
        <button onClick={changeTasksHandler}>
          Show {isAllTasks ? "Upcoming": "All"}
        </button>
        </div>

    <ul className={classes.list}>
      {!displayAllTasks && sortedTasks.map((task) => (
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
       {displayAllTasks && allTasks.map((task) => (
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