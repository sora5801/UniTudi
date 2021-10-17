import React from "react";

import Card from "../../UI/Card";
import TaskItem from "./TaskItem";
import Button from "../../UI/Button";
import "./TaskList.css";

const TaskList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="task-list center">
        <Card>
          <h2>No tasks found. Maybe create one?</h2>
          <Button to ="/tasks/new">Add Task</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {props.items.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          name={task.name}
          description={task.description}
          creatorId={task.creator}
          onDelete={props.onDeleteTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
