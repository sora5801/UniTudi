import React from "react";
export const Checkbox = ({id, taskDesc}) => {
    const archiveTask = () => {
   
    };

    return (
        <div className="checkbox-holder" data-testid="checkbox-action"
        onClick={()=> archiveTask()}
        onKeyDown={()=> archiveTask()}
        role="button"
        tabIndex={0}>
            <span className="checkbox" />
        </div>
    )
};