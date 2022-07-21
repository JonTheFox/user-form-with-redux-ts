import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from "./userSlice";
import styles from "./UserForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";

interface UserFormData {
  username: string | undefined;
  phoneNumber: number | undefined;
  password: string | undefined;
  passwordConfirmation: string | undefined;
}

interface UserFormErrors {
  username?: string | undefined;
  phoneNumber?: string | undefined;
  password?: string | undefined;
  passwordConfirmation?: string | undefined;
}

export function UserForm() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");

  const incrementValue = Number(incrementAmount) || 0;

  const validateForm = (formData: UserFormData) => {
    const errors: UserFormErrors = {};

    if (!formData.username) {
      errors.username = "Required";
    } else if (
      // double check, for staying bullet proof when we change the input element's maxLength attribute value
      formData.username.length > 24
    ) {
      errors.username = "Up to 24 character allowed";
    }

    if (!formData.phoneNumber) {
      errors.phoneNumber = "Required";
    } else if (
      // for phone numbers, we accept the following formats:
      // Israeli telphone number: 036357269
      // Israeli cellphone number: 0548088929
      // NOTE: we accepts an input without a leading 0, as well. For example: 548088929
      !/^0?(([23489]{1}\d{7})|[5]{1}[012345689]\d{7})$/im.test(
        formData.phoneNumber.toString()
      )
    ) {
      errors.phoneNumber =
        "Please enter a valid Israeli phone number (05xxxxxxxx)";
    }

  

    if (!formData.password) {
      errors.password = "Required";
      // TODO: change the condition below to a regex
      
    } else {
      const passwordRegex = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,12})/, "im");
      if (!passwordRegex.test(
        
        formData.password
      )) {
         errors.password = "Please enter 6-12 characters, including at least one uppercase letter and one special character)";
      }
    }

    if (!formData.passwordConfirmation) {
      errors.passwordConfirmation = "Required";
      // TODO: change the condition below
    } else if (formData.passwordConfirmation !== formData.password ) {
      errors.passwordConfirmation = "Passwords don't match.";
    }

    return errors;
  };

  return (
    <div>
      <div className={styles.row}>
        <div>
          <h1>Any place in your app!</h1>
          <Formik
            initialValues={{
              username: "elkana",
              phoneNumber: undefined,
              password: "elkana",
              passwordConfirmation: "",
            }}
            validate={validateForm}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <ul>
                  <li className={styles.row}>
                    <label htmlFor="username">Username</label>
                    <Field
                      id="username"
                      type="text"
                      name="username"
                      maxLength="24"
                    />
                    <ErrorMessage name="username" component="div" />
                  </li>

                  <li className={styles.row}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <Field id="phoneNumber" name="phoneNumber" type="number" />
                    <ErrorMessage name="phoneNumber" component="div" />
                  </li>

                  <li className={styles.row}>
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      maxLength="12"
                    />
                    <ErrorMessage name="password" component="div" />
                  </li>

                  <li className={styles.row}>
                    <label htmlFor="passwordConfirmation">Password</label>
                    <Field
                      type="password"
                      name="passwordConfirmation"
                      id="passwordConfirmation"
                      maxLength="12"
                    />
                    <ErrorMessage name="passwordConfirmation" component="div" />
                  </li>
                </ul>

                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(incrementValue))}
        >
          Add Async
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(incrementIfOdd(incrementValue))}
        >
          Add If Odd
        </button>
      </div>
    </div>
  );
}
