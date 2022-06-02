import { useReducer } from "react";

const dispatchFunc = (prevState, action) => {
  console.log(prevState);
  if (action.type === "CHANGE") {
    console.log(action.enteredValue);
    return {
      ...prevState,
      enteredValue: action.enteredValue,
      isTouched: true,
    };
  }
  if (action.type === "BLUR") {
    return {
      ...prevState,
      isTouched: action.isTouched,
    };
  }
  return prevState;
};

const INITIAL_STATE = {
  enteredValue: "",
  isTouched: false,
};

export const useInput = (validateState) => {
  const [stateValues, dispatch] = useReducer(dispatchFunc, INITIAL_STATE);

  const valueIsValid = validateState(stateValues.enteredValue);
  const hasError = !valueIsValid && stateValues.isTouched;

  const valueChangeHandler = (event) => {
    dispatch({ type: "CHANGE", enteredValue: event.target.value });
  };

  const inputBlurHandler = (event) => {
    dispatch({ type: "BLUR", isTouched: true });
  };

  return {
    value: stateValues.enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
  };
};
