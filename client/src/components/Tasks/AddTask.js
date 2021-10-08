import React, {useState} from 'react';

const AddTask = ({
    showAddTaskMain = true,
    shouldShowMain = false,
    showQuickAddTask,
    setShowQuickAddTask,
  }) => {
    const [task, setTask] = useState('');
    const [taskDate, setTaskDate] = useState('');
};

export default AddTask;