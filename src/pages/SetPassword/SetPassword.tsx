import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import styles from "./index.module.css";
import useSetPassword from "../../hooks/useSetPassword";

import LoginScreenTemplate from "../../components/LoginScreenTemplate";
import Box from '@mui/material/Box';
import PasswordValid from '../../assets/images/password-valid.svg'
import PasswordInalid from '../../assets/images/password-invalid.svg'
import {cloneDeep} from 'lodash'
import { LinkExpired } from './linkExpired';
import {staticValidationScheme} from '../../utils/services/helpers';


export const SetPassword = () => {

  const {query, resetPasswordMutation, setState, state} = useSetPassword();

  const [isSetPasswordDisabled, toggleSetPasswordDisabled] = useState<boolean>(true);

  const [focusedInput, setFocusedInput] = useState<string>('')
  const [validatorsArray_password, setValidatorsArray_password] = useState<Array<validtr>>(cloneDeep(staticValidationScheme))
  const [validatorsArray_conf_password, setValidatorsArray_conf_password] = useState<Array<validtr>>(cloneDeep(staticValidationScheme))

  // const allValidationCorrectCondition = validatorsArray_password.some(condtn => !condtn.fulfilled)

  useEffect(() => {
  if (
    !state.password ||
    !state.confirmPassword ||
    validatorsArray_password.some(condtn => !condtn.fulfilled) ||
    validatorsArray_conf_password.some(condtn => !condtn.fulfilled)
  ) {
    toggleSetPasswordDisabled(true);
  } else {
    toggleSetPasswordDisabled(false);
  }
  }, [state, validatorsArray_password, validatorsArray_conf_password]);

  type validtr = {
    name: string
    rule: RegExp
    fulfilled: boolean
  }

  const checkValidation = ({
    currentValue, name, setterName, 
  }: {currentValue: string, name: validtr[], setterName: React.Dispatch<React.SetStateAction<validtr[]>>}) => {
    let newValidtrArray: Array<validtr> = []

    name.forEach(ruleObj => {

        let tempObj = { ...ruleObj }
        let flag = currentValue.match(ruleObj.rule)

        tempObj = {
          name: ruleObj.name,
          rule: ruleObj.rule,
          fulfilled: !!flag,
        }

        newValidtrArray.push(tempObj)

      })

      setterName(newValidtrArray)
  }

  // on input change function
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: "confirmPassword" | "password"
  ) => {
    const lclState = state;
    lclState[name] = e.target.value;

    setState(state => ({
      ...state,
      [name]: e.target.value
    }))

    /**static if block setting to debug error message */
    if (!e.target.value) {
      validateCredentials(name);
    }

    if (name === 'password') {
      checkValidation({
        currentValue: e.target.value,
        name: validatorsArray_password, 
        setterName: setValidatorsArray_password
      })
    }
    if (name === 'confirmPassword') {
      checkValidation({
        currentValue: e.target.value,
        name: validatorsArray_conf_password, 
        setterName: setValidatorsArray_conf_password
      })
      if (state.password !== state.confirmPassword) { 
        setState({
          ...state,
          success: '',
          error: `Both passwords must match`
        });
      }else {
        
        setState({
          ...state,
          error: ``,
          success: `Both passwords match`
        });
      }
      
    }
  };

  // Function is responsible for the validation of input fields
  const validateCredentials = (name: "confirmPassword" | "password") => {

  }

  const handleBlur: (e:React.ChangeEvent<HTMLElement>, name: "confirmPassword" | "password") => void = (e, name) => {
    // setFocusedInput('')
    validateCredentials(name)
  }

  // Form submission
  const submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (state.password === state.confirmPassword) {
      setState({
        ...state,
        error: ''
      });
      if (query && query.data) resetPasswordMutation({password: state.password, id: query.data.id });
    } else {
      setState({
        ...state,
        error: `Confirm password doesn'\nt match`
      })
    }
  };

/**
 * UI
 */
  return (
    <>
      <LoginScreenTemplate>
        {state.expired ?
          <LinkExpired />
          :
          <Grid className={`${styles["content"]}`}>
            <Grid className="">
              <div className={`${styles["header"]}`}>WELCOME to neom heritage</div>
            </Grid>
            <div className={`${styles["subHeader"]}`}>Set your password</div>
            <TextInput
              className={`${styles["password"]}`}
              label="Password"
              type={"password"}
              value={state.password}
              onChange={(e) => handleChange(e, "password")}
              onBlur={(e) => handleBlur(e, "password")}
              onFocus={e => setFocusedInput("password")}
            />
            <TextInput
              className={`${styles["confirm-password"]}`}
              label="Confirm Password"
              type={"password"}
              autoComplete="new-password"
              value={state.confirmPassword}
              error={Boolean(state.error)}
              errorText={state.error}
              success={Boolean(state.success)}
              successText={state.success}
              FormHelperTextProps={
                {
                  sx: {color: Boolean(state.success) ? 'green' : '',}
                }
              }
              onChange={(e) => handleChange(e, "confirmPassword")}
              onBlur={(e) => handleBlur(e, 'confirmPassword')}
              onFocus={e => setFocusedInput("confirmPassword")}
            />
            <div className={`${styles["password-help-section"]}`}>
              <div className={`${styles["password-help-title"]}`}>Your {
                focusedInput === 'confirmPassword' ? 'Confirm Password' : 'Password'
              } must have at least:</div>
              <section className={`${styles["validtr-list"]}`}>
                {
                  (focusedInput === 'password' ? validatorsArray_password :
                    validatorsArray_conf_password
                  ).map((validateConditionObj, i) => {

                    return <div key={i}>
                      <div className={`${styles["validate-statement-row"]}`}>
                        <div>
                          <Box
                            component="img"
                            alt="NEOM logo"
                            src={validateConditionObj.fulfilled ? PasswordValid : PasswordInalid}
                          />
                        </div>
                        <div>
                          {validateConditionObj.name} {validateConditionObj.fulfilled}
                        </div>
                      </div>
                    </div>
                  })
                }
              </section>
            </div>
            <Button
              className={`${styles["sign-in-btn"]}`}
              label="SET PASSWORD"
              disabled={isSetPasswordDisabled}
              onClick={(e) => submit(e)}
            />
          </Grid>}
      </LoginScreenTemplate>
    </>
  );
}
