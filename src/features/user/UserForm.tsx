import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './userSlice';
import styles from './UserForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';

interface UserFormData {
  username: string | undefined;
  phoneNumber: number | undefined;
  password: string | undefined;
  passwordRepeat: string | undefined;
}

interface UserFormErrors {
  username?: string | undefined;
  phoneNumber?: string | undefined;
  password?: string | undefined;
  passwordRepeat?: string | undefined;
}

export function UserForm() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  const validateForm = (formData: UserFormData) => {
    const errors: UserFormErrors = {};
  
    if (!formData.username) {
      errors.username = 'Required';
    } else if (
      // double check, for staying bullet proof when we change the input element's maxLength attribute value
      formData.username.length > 32
    ) {
      errors.username = "Up to 32 character allowed";
    }
       if (!formData.phoneNumber) {
   
      errors.phoneNumber = 'Required';
    } else if (
    // for a phone number, we accept the following formats:
    // Israeli telphone number: 036357269
    // Israeli cellphone number: 0548088929
    // NOTE: we accepts an input without a leading 0, as well. For example: 548088929 
     !(/^0?(([23489]{1}\d{7})|[5]{1}[012345689]\d{7})$/im.test(formData.phoneNumber.toString()))
    ) {
      errors.phoneNumber = "Please enter a valid Israeli phone number (05xxxxxxxx)"
    }
    return errors;
  }

  return (
    <div>

      <div className={styles.row}>
        <div>
          <h1>Any place in your app!</h1>
          <Formik
            initialValues={{ username: 'elkana' , phoneNumber: undefined, password: 'elkana', passwordRepeat: "" }}
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
                <Field id="username" type="text" name="username" maxLength="32" />
                 <label htmlFor="username">Username</label>
          <Field id="firstName" name="firstName" placeholder="" />

                <ErrorMessage name="username" component="div" />
                <Field type="number" name="phoneNumber" />
                <ErrorMessage name="phoneNumber" component="div" />
                <Field type="password" name="password" />
                <ErrorMessage name="password" component="div" />
                <Field type="password" name="passwordRepeat" />
                <ErrorMessage name="passwordRepeat" component="div" />
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
