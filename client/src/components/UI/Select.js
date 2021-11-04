import React, { useReducer, useEffect } from "react";

import "./Select.css";

const selectReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
        return {
            ...state,
            value: action.val,
            isValid: true,
        };
    case 'TOUCH':
        return {
            ...state,
            isTouched: true
        };
    default:
        return state;
  }
};

const Select = (props) => {
  const [inputState, dispatch] = useReducer(selectReducer, {
    value: (props.initialValue ? props.initialValue : (props.validValues ? props.validValues[0].name : 'Select a value')),
    isTouched: false,
    isValid: true
  });

  const {id, onSelect} = props;
  const {value, isValid} = inputState;

  useEffect(()=> {
      onSelect(id, value, isValid);
  }, [id, value, isValid, onSelect]);

  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value
    });
  };

  const touchHandler = () => {
    dispatch({
        type: 'TOUCH'
    });
  };

  const element =
      (<select
        id={props.id}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
      >
          {props.validValues ? props.validValues.map((e) => {
              return <option key={e.value}>{e.name}</option>;
           }) : <option key={'Select a value'}>{'Select a value'}</option>}
      </select>);

  return (
    <div className={'form-control'}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
};

export default Select;