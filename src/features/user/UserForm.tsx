import React, { ChangeEvent, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  decrement,
  // increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectUsername,
  selectPhoneNumber,
  setUser
} from "./userSlice";
import styles from "./UserForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';


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

interface TabPanelProps {
  value: number;
  index: number;
  children:any;
}

export function UserForm() {
  const username = useAppSelector(selectUsername);
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

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
      // NOTE: we accept an input without a leading 0, as well. For example: 548088929
      !/^0?(([23489]{1}\d{7})|[5]{1}[012345689]\d{7})$/im.test(
        formData.phoneNumber?.toString()
      )
    ) {
      errors.phoneNumber =
        "Please enter a valid Israeli phone number";
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

  const handleTabChange = (ev: ChangeEvent<{}>, tabIndex: any) : void => {
    setSelectedTabIndex(tabIndex);
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
          {children}
          </Box>
        )}
      </div>
    );
}

  return (
    <div>
      <div className={styles.row}>
        <div>
          <h1>User Details</h1>

           <Tabs
          value={selectedTabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="user form and details tabs"
        >
          <Tab id="userFormTab" label="User" aria-controls="tab-panel--user-form" />
          <Tab id="userDetailsTab" label="User" aria-controls="tab-panel--user-details" />
     
        </Tabs>

          <TabPanel value={selectedTabIndex} index={0}>
        <Formik
            initialValues={{
              username: "elkana",
              phoneNumber: 548088924,
              password: "qweQWE!",
              passwordConfirmation: "qweQWE!",
            }}
            validate={validateForm}
            onSubmit={async (formData, { setSubmitting }) => {
              const {username, password, phoneNumber} = formData;
              await dispatch(setUser({username, password, phoneNumber}));
              setTimeout(() => {
                alert(JSON.stringify(formData, null, 2)); 
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
      </TabPanel>

       <TabPanel value={selectedTabIndex} index={1}>

        <div>
          <h3>User Name: <span className="value-col">{username}</span></h3>
          <h4>Phone number: <span className="value-col">{phoneNumber}</span></h4>
        </div>
       </TabPanel>
          
       
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
        <span className={styles.value}>count value would go here</span>
        <button
          className={styles.button}
          aria-label="Increment value"
         
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
