import { useContext, useReducer } from "react";
import CartContext from "../../store/cart-context";
import classes from "./Checkout.module.css";
const INITIAL_STATE = {
  name: "",
  street: "",
  postalCode: "",
  city: "",
  validation: {
    nameIsValid: false,
    nameIsTouched: false,
    streetIsValid: false,
    streetIsTouched: false,
    postalCodeIsValid: false,
    postalCodeIsTouched: false,
    cityIsValid: false,
    cityIsTouched: false,
  },
};

const dispatchFunc = (prevState, action) => {
  console.log(prevState);
  switch (action.type) {
    case "CHANGE_HANDLER":
      return { ...prevState, [action.id]: action.value };
    case "RESET":
      return INITIAL_STATE;

    case "VALIDATION":
      return {
        ...prevState,
        validation: {
          nameIsValid: prevState.name.trim() !== "",
          nameIsTouched: true,
          streetIsValid: prevState.street.trim() !== "",
          streetIsTouched: true,
          postalCodeIsValid: prevState.postalCode.trim() !== "",
          postalCodeIsTouched: true,
          cityIsValid: prevState.city.trim() !== "",
          cityIsTouched: true,
        },
      };
    default:
      return prevState;
  }
};

const Checkout = (props) => {
  const [state, dispatch] = useReducer(dispatchFunc, INITIAL_STATE);
  const { items, totalAmount, resetItems } = useContext(CartContext);
  //   console.log(items, totalAmount, removeItem);

  const inputChangeHandler = (e) => {
    dispatch({
      type: "CHANGE_HANDLER",
      value: e.target.value,
      id: e.target.id,
    });
  };

  //   let formIsValid = false;

  const confirmHandler = (event) => {
    event.preventDefault();
    dispatch({ type: "VALIDATION" });
    const valuesAreValid =
      !state.validation.nameIsValid ||
      !state.validation.streetIsValid ||
      !state.validation.cityIsValid ||
      !state.validation.postalCodeIsValid;
    if (valuesAreValid) {
      return;
    }
    console.log({
      clientData: state,
      orderData: { items, totalAmount },
    });
    resetItems();
    dispatch({ type: "RESET" });
  };

  const nameClass =
    !state.validation.nameIsValid && state.validation.nameIsTouched
      ? classes.invalid
      : classes.control;
  const streetClass =
    !state.validation.streetIsValid && state.validation.streetIsTouched
      ? classes.invalid
      : classes.control;
  const postalCodeClass =
    !state.validation.postalCodeIsValid && state.validation.postalCodeIsTouched
      ? classes.invalid
      : classes.control;
  const cityClass =
    !state.validation.cityIsValid && state.validation.cityIsTouched
      ? classes.invalid
      : classes.control;

  return (
    <form onSubmit={confirmHandler}>
      <div className={nameClass}>
        <label htmlFor="name">Your name</label>
        <input
          value={state.name}
          onChange={inputChangeHandler}
          type="text"
          id="name"
        />
      </div>
      <div className={streetClass}>
        <label htmlFor="street">Street</label>
        <input
          value={state.street}
          type="text"
          id="street"
          onChange={inputChangeHandler}
        />
      </div>
      <div className={postalCodeClass}>
        <label htmlFor="postalCode">Postal code</label>
        <input
          value={state.postalCode}
          type="text"
          id="postalCode"
          onChange={inputChangeHandler}
        />
      </div>
      <div className={cityClass}>
        <label htmlFor="city">City</label>
        <input
          value={state.city} 
          type="text"
          id="city"
          onChange={inputChangeHandler}
        />
      </div>
      <button type="button" onClick={props.onCancel}>
        Cancel
      </button>
      <button>Confirm</button>
    </form>
  );
};
export default Checkout;
