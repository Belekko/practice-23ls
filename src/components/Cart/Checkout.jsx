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
      state.validation.nameIsValid &&
      state.validation.streetIsValid &&
      state.validation.cityIsValid &&
      state.validation.postalCodeIsValid;
    console.log(valuesAreValid);
    if (!valuesAreValid) {
      return;
    } else {
      const clientData = state;
      delete clientData.validation
      console.log(clientData);
      const orderItem = {
        clientData: clientData,
        orderData: { items, totalAmount },
      };
      const fetchData = async () => {
        try {
          const response = await fetch(
            "https://food-order-basket-default-rtdb.firebaseio.com/orders.json",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderItem),
            }
          );
          if (!response.ok) {
            throw new Error("kata bar!");
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchData();
      resetItems();
      dispatch({ type: "RESET" });
    }
  };

  const nameIsInvalid =
    !state.validation.nameIsValid && state.validation.nameIsTouched;
  const nameClass = nameIsInvalid
    ? `${classes.invalid} ${classes.control}`
    : classes.control;

  const streetIsInvalid =
    !state.validation.streetIsValid && state.validation.streetIsTouched;
  const streetClass = streetIsInvalid
    ? `${classes.invalid} ${classes.control}`
    : classes.control;

  const postalCodeIsInvalid =
    !state.validation.postalCodeIsValid && state.validation.postalCodeIsTouched;
  const postalCodeClass = postalCodeIsInvalid
    ? `${classes.invalid} ${classes.control}`
    : classes.control;

  const cityIsInvalid =
    !state.validation.cityIsValid && state.validation.cityIsTouched;
  const cityClass = cityIsInvalid
    ? `${classes.invalid} ${classes.control}`
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
        {nameIsInvalid && (
          <p className={classes["error-text"]}>Name must not be empty!</p>
        )}
      </div>
      <div className={streetClass}>
        <label htmlFor="street">Street</label>
        <input
          value={state.street}
          type="text"
          id="street"
          onChange={inputChangeHandler}
        />
        {streetIsInvalid && (
          <p className={classes["error-text"]}>Street must not be empty!</p>
        )}
      </div>
      <div className={postalCodeClass}>
        <label htmlFor="postalCode">Postal code</label>
        <input
          value={state.postalCode}
          type="text"
          id="postalCode"
          onChange={inputChangeHandler}
        />
        {postalCodeIsInvalid && (
          <p className={classes["error-text"]}>PostalCode must not be empty!</p>
        )}
      </div>
      <div className={cityClass}>
        <label htmlFor="city">City</label>
        <input
          value={state.city}
          type="text"
          id="city"
          onChange={inputChangeHandler}
        />
        {cityIsInvalid && (
          <p className={classes["error-text"]}>City must not be empty!</p>
        )}
      </div>
      <button type="button" onClick={props.onCancel}>
        Cancel
      </button>
      <button>Confirm</button>
    </form>
  );
};
export default Checkout;
