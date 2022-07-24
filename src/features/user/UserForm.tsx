import React, { useState, useCallback } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectUsername,
  selectPhoneNumber,
  selectPassword,
  setUser,
} from "./userSlice";
import styles from "./UserForm.module.css";
import { Formik, ErrorMessage } from "formik";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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
  className: string;
  children: any;
}

export function UserForm() {
  const username = useAppSelector(selectUsername);
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const password = useAppSelector(selectPassword);
  const dispatch = useAppDispatch();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const MAX_PASSWORD_LENGTH = 12;

  const validateForm = useCallback((formData: UserFormData) => {
    const errors: UserFormErrors = {};

    if (!formData.username) {
      errors.username = "Required";
    } else if (
      // in addition to the maxLength restriction applied to the input DOM element),
      // double check the length for staying bullet proof in case we change the input element's maxLength attribute value
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
      errors.phoneNumber = "Please enter a valid Israeli phone number";
    }

    if (!formData.password) {
      errors.password = "Required";
    } else {
      const passwordRegex = new RegExp(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,12})/,
        "im"
      );
      if (!passwordRegex.test(formData.password)) {
        errors.password =
          "Please enter 6-12 characters, including at least one uppercase letter and one special character.";
      }
    }

    if (!formData.passwordConfirmation) {
      errors.passwordConfirmation = "Required";
    } else if (formData.passwordConfirmation !== formData.password) {
      errors.passwordConfirmation = "Passwords don't match.";
    }

    return errors;
  }, []);

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, className, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`user-tabpanel-${index}`}
        className={styles.userTabPanel}
        aria-labelledby={`user-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box className={styles[className]} p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.tabsContainer}>
        <h1>User Details</h1>

        <Tabs
          className={styles.tabs}
          value={selectedTabIndex}
          onChange={(ev, tabIndex) => setSelectedTabIndex(tabIndex)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="user form and details tabs"
        >
          <Tab
            id="userFormTab"
            label="Form"
            aria-controls="tab-panel--user-form"
          />
          <Tab
            id="userDetailsTab"
            label="User"
            aria-controls="tab-panel--user-details"
          />
        </Tabs>

        <TabPanel value={selectedTabIndex} index={0} className="formPanel">
          <Formik
            initialValues={{
              username,
              phoneNumber,
              password,
              passwordConfirmation: password,
            }}
            validate={validateForm}
            onSubmit={(formData) => {
              try {
                const { username, password, phoneNumber } = formData;
                console.log(
                  "username, password, phoneNumber: ",
                  username,
                  password,
                  phoneNumber
                );
                dispatch(setUser({ username, password, phoneNumber }));
              } catch (err) {
                console.error(err);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <ul>
                    <li className={styles.row}>
                      <TextField
                        id="username"
                        value={values.username}
                        name="username"
                        label="Username"
                        variant="outlined"
                        inputProps={{ maxLength: 24 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      {errors.username && touched.username && errors.username}
                    </li>

                    <li className={styles.row}>
                      <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        type="number"
                        label="Phone Number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{ maxLength: 10 }}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <ErrorMessage name="phoneNumber" component="div" />
                    </li>

                    <li className={styles.row}>
                      <TextField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage name="password" component="div" />
                    </li>

                    <li className={styles.row}>
                      <TextField
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        type="password"
                        label="Confirm Password"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{ maxLength: MAX_PASSWORD_LENGTH }}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <ErrorMessage
                        name="passwordConfirmation"
                        component="div"
                        className={styles.error}
                      />
                    </li>
                  </ul>

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={
                      !!Object.keys(errors).length ||
                      !Object.keys(touched).length
                    }
                    className={styles.submitBtn}
                  >
                    Submit
                  </Button>
                </form>
              );
            }}
          </Formik>
        </TabPanel>

        <TabPanel
          value={selectedTabIndex}
          index={1}
          className="displayTabPanel"
        >
          <div>
            <h3>
              User Name: <span>{username}</span>
            </h3>
            <h4>
              Phone number:{" "}
              <span className={styles.valueCol}>{phoneNumber}</span>
            </h4>
          </div>
        </TabPanel>
      </div>
    </div>
  );
}
