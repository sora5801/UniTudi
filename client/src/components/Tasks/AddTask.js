import React, {useState} from 'react';
import {useSelectedProjectValue} from 'selected-project-context';

const AddTask = ({
    showAddTaskMain = true,
    shouldShowMain = false,
    showQuickAddTask,
    setShowQuickAddTask,
  }) => {
    const [task, setTask] = useState("");
    const [taskDate, setTaskDate] = useState("");
    const [project, setProject] = useState("");
    const [showMain, setShowMain] = useState(shouldShowMain);
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);
    const [showTaskDate, setShowTaskDate] = useState(false);
  
    const { selectedProject } = useSelectedProjectValue();
  
    const addTask = () => {
      const projectId = project || selectedProject;
      let collatedDate = "";
  
      if (projectId === "TODAY") {
        collatedDate = moment().format("DD/MM/YYYY");
      } else if (projectId === "NEXT_7") {
        collatedDate = moment().add(7, "days").format("DD/MM/YYYY");
      }
      return (
       task
      );
    };
};

export default AddTask;