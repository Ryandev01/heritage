import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
// import { gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import "./style.css";
import { SideContent } from "./sideContent";
import PositionedSnackbar from "../../components/Snackbar";

import {
  validateEmail,
  validatePassword
} from "../../utils/services/helpers";
import useLogin from "../../hooks/useLogin";
import { getSupportEmail } from "../../utils/storage/storage";

type stateInput = {
  email: string;
  password: string;
};

type FormError = {
  show: boolean;
  message: string;
};

type FormErrors = {
  email: FormError;
  password: FormError;
};

export function Login() {
  const { clientLogin, error } = useLogin();
  const navigate = useNavigate();

  const [state, setState] = useState<stateInput>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: {
      show: false,
      message: "",
    },
    password: {
      show: false,
      message: "",
    },
  });

  const [snackbarErrorMessage, setSnackbarErrorMessage] =
    useState<boolean>(false);
  const [isSignInDisabled, toggleSignInDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (
      (formErrors.email.show && state.email) ||
      (formErrors.password.show && state.password) ||
      !state.email ||
      !state.password
    ) {
      toggleSignInDisabled(true);
    } else {
      toggleSignInDisabled(false);
    }
  }, [formErrors, state]);

  // on input change function
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: "email" | "password"
  ) => {
    const lclState = state;
    lclState[name] = e.target.value;
    setFormErrors({
      ...formErrors,
      email: {
        show: false,
        message: "",
      },
    });

    if (name === "password") {
      validateCredentials();
    }
    setState({ ...state, ...lclState });
  };

  // Function is responsible for the validation of input fields
  const validateCredentials = () => {
    if (!validateEmail(state.email)) {
      setFormErrors((state: any) => ({
        ...state,
        email: {
          show: true,
          message: "Invalid email",
        },
      }));
    } else if (!validatePassword(state.password)) {
      setFormErrors((state: any) => ({
        ...state,
        password: {
          show: true,
          message:
            "Password must contain min 8 letter with at least a symbol, upper and lower case letters and a number",
        },
      }));
    } else {
      setFormErrors((state: any) => ({
        ...state,
        email: {
          show: false,
          message: "",
        },
        password: {
          show: false,
          message: "",
        },
      }));
    }
  };

  // onkeydown
  const onkeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' && !isSignInDisabled) {
      submit(e);
    }
  }

  // Form submission
  const submit = async (e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const data = await clientLogin({
      identifier: state.email,
      password: state.password,
    });
    if (data) {
      // navigate("/");
      window.location.reload();
    } else {
      setSnackbarErrorMessage(true);
    }
  };

  return (
    <Grid className="loginContainer" container direction="row" item xs={12}>
      <SideContent />
      <Grid
        className="contentContainer"
        display="flex"
        alignItems="center"
        justifyContent="center"
        item
        sm={6}
        md={9}
        lg={8}
        xl={8}
      >
        <form onSubmit={(e) => submit(e)}>
          <Grid className="content">
            <Grid className="">
              <div className="header">Sign in to neom heritage</div>
            </Grid>
            <div className="subHeader">Enter your details below</div>
            <TextInput
              className={`login-email`}
              label="Email Address"
              value={state.email}
              error={formErrors.email.message ? true : false}
              errorText={formErrors.email.message}
              onChange={(e) => handleChange(e, "email")}
              onBlur={() => validateCredentials()}
            />
            <TextInput
              className={`login-pwd`}
              label="Password"
              type={"password"}
              value={state.password}
              // error={formErrors.password.message ? true : false}
              // errorText={formErrors.password.message}
              onChange={(e) => handleChange(e, "password")}
              onKeyDown={(e) => onkeydown(e)}
              onBlur={() => validateCredentials()}
            />
            <Button
              className={"sign-in-btn"}
              label="SIGN IN"
              disabled={isSignInDisabled}
              type='submit'
              onClick={(e) => submit(e)}
            />
          </Grid>
        </form>
        <div className="bottomText">
          <p>Don’t have an account yet or forgot your password?</p>
          <p>
            Contact{" "}
            <span>
              <a
                href={`mailto: ${getSupportEmail() || ''}?subject = xyz`}
                target={"_blank"}
                rel="noreferrer"
              >
                {getSupportEmail() || ''}
              </a>
            </span>
          </p>
        </div>
      </Grid>
      <PositionedSnackbar
        message={error || "User not found"}
        severity={"error"}
        open={snackbarErrorMessage}
        handleClose={() => setSnackbarErrorMessage(false)}
      />
    </Grid>
  );
}
