import {
  Box,
  Grid,
  Button as DefaultButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Chip,
  StepButton,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AddNewItemProps,
  StepContentTypes,
} from "../../../../types/CustomDrawerTypes";
import { tabNameProps } from "../../../../types/SearchResultsTabsProps";
import {
  addItemDefaultSteps,
  handleEnter,
} from "../../../../utils/services/helpers";
import styles from "./addNewItem.module.css";
import TextInput from "../../../../components/TextInput";
import Button from "../../../../components/Button";
import DropdownComponent from "../../../Dropdown/index";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setAddNewItemWindowType,
  storeAddItemProgressState,
  toggleAddItemWindowMinimized,
  toggleNewItemWindow,
  toggleShowAddSuccess,
  toggleShowEditSuccess,
} from "../../../../store/reducers/searchResultsReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { SelectChangeEvent } from "@mui/material/Select";
import { useFormik } from "formik";
import AutoComplete from "../../../AutoComplete";
import { StepperKeywordsComponent } from "../../../StepperKeywordsComponent";
import { updateKeywords } from "../../../../api/keywords";
import StepContent from './form';

const commonSelectSxStyles = {
  textAlign: "left",
  "& .MuiSelect-select": {
    padding: "0.5em 1em",
    color: "var(--grey-text)",
  },
};
const textInputSxStyles = {
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    border: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root ": {},
  "& .MuiInputBase-input.MuiOutlinedInput-input ": {
    lineHeight: "1.2",
    border: "1.4px solid #fff",
    padding: "0.5em 1em",
    height: "1.4em",
  },
  "& .MuiOutlinedInput-notchedOutline span": {
    opacity: 1,
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    color: "transparent",
  },
};
const commonFormControlSxStyles = {
  width: "100%",
  flexGrow: 0,
  "& .MuiInputBase-root": {
    backgroundColor: "#fff",
  },
};

export const stepperIconSx = {
  color: "#fff",
  border: "1px solid var(--table-black-text)",
  borderRadius: "50%",
  "& .MuiStepIcon-text": {
    fill: "var(--table-black-text)",
  },
  "&.MuiStepIcon-root.Mui-active .MuiStepIcon-text": {
    fill: "#fff",
  },
  "&.MuiStepIcon-root.Mui-active, &.MuiStepIcon-root.Mui-completed": {
    color: "var(--table-black-text)",
    border: "none",
  },
};

const AddNewPlace = ({ onHide, create }: AddNewItemProps) => {
  let { tabName } = useParams<{ tabName?: tabNameProps }>();

  const { showAddSuccess, addItemProgressState } = useSelector((state: RootState) => state.searchResults);
  const { options } = useSelector((state: RootState) => state.refinedSearch);

  const { edit, tabData } = useSelector((state: RootState) => state.tabEdit);

  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState({
    siteDescription: ''
  });
  const [skipped, setSkipped] = useState(new Set<number>());
  const [formError, setFormError] = useState<string>('');

  const [steps, setSteps] = useState<Array<string>>(addItemDefaultSteps)

  const dispatch = useDispatch()

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  const handleNext = (e: any, data: any, navigateOnly?: boolean) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (navigateOnly) return

    if (activeStep + 1 === steps.length && data) {
      if (create && !edit) {
        create({
          ...data,
        });
        handleReset()
        updateKeywords({
          keywords: data.keywords
        }, 'place')
        dispatch(toggleShowAddSuccess(true));
        dispatch(toggleNewItemWindow(false))
      }

    }
    if (edit && create && data) {
      create({
        ...data,
      });

      if (data && data.keywords && data.keywords.length > 0) {

        handleReset();
        updateKeywords({
          keywords: data.keywords
        }, 'place')
        dispatch(toggleNewItemWindow(false));
      }
    }

    setSkipped(newSkipped);
  };

  const handleBack = () => {

    if (activeStep === 0) {
      dispatch(toggleNewItemWindow(false))
      dispatch(setAddNewItemWindowType(null))
      handleReset()
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleHide = () => {
    onHide()

    /** store data when unmounting */
    dispatch(storeAddItemProgressState({
      activeStep: activeStep,
      formData: {
        ...formik.values
      }
    }))
  }

  const handleReset = () => {
    setActiveStep(0);

    dispatch(toggleAddItemWindowMinimized(null))

    /** remove the data when change in add item type window occurs */
    dispatch(storeAddItemProgressState(null))

  }

  //     setActiveStep((prevActiveStep) => prevActiveStep + 1);

  //     if (activeStep + 1 === steps.length && data) {
  //       if (create && !edit) {
  //         create({
  //           ...data,
  //         });
  //       }
  //       handleHide();
  //       dispatch(toggleNewItemWindow(false));
  //     }
  //     if (edit && create && data) {
  //       create({
  //         ...data,
  //       });
  //       handleHide();
  //       dispatch(toggleNewItemWindow(false));
  //     }

  //     setSkipped(newSkipped);
  //   };

  //   const handleBack = () => {
  //     if (activeStep === 0) {
  //       dispatch(toggleNewItemWindow(false));
  //       dispatch(setAddNewItemWindowType(null));
  //       dispatch(toggleAddItemWindowMinimized(null));

  //       /** remove the data when change in add item type window occurs */
  //       dispatch(storeAddItemProgressState(null));
  //     } else {
  //       setActiveStep((prevActiveStep) => prevActiveStep - 1);
  //     }
  //   };

  //   const handleSkip = () => {
  //     if (!isStepOptional(activeStep)) {
  //       // You probably want to guard against something like this,
  //       // it should never occur unless someone's actively trying to break something.
  //       throw new Error("You can't skip a step that isn't optional.");
  //     }

  //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //     setSkipped((prevSkipped) => {
  //       const newSkipped = new Set(prevSkipped.values());
  //       newSkipped.add(activeStep);
  //       return newSkipped;
  //     });
  //   };

  //   const handleHide = () => {
  //     onHide();

  //     /** store data when unmounting */
  //     dispatch(
  //       storeAddItemProgressState({
  //         activeStep: activeStep,
  //         formData: {
  //           ...formik.values,
  //         },
  //       })
  //     );
  //   };

  //   const handleReset = () => {
  //     setActiveStep(0);
  //   };

  const handleStep = (step: number) => () => {
    if (activeStep > step) {
      setActiveStep(step);
    }
  };

  const handleClear = (name?: "siteType" | "period" | "stateOfConservation") => {
    if (name) {
      formik.values[name] = [];
    }
  };

  const validation = (values: any, formikObject: any, navigateOnly?: boolean) => {
    let currentError = "";

    if (!values.placeNumber) {
      currentError = "Place Number is required";
    }
    if (values.placeNumber.length < 3) {
      currentError = "Place Number shall be of minimum 3 characters";
    }

    if (!currentError) {
      handleNext(null, values, navigateOnly);
    } else {
      if (activeStep === 0) {
        formikObject.setErrors({ placeNumber: currentError })
      } else {
        handleNext(null, values, navigateOnly);
      }
    }

  }

  const formik = useFormik({
    initialValues: {
      placeNumber: edit ? tabData.placeNumber : "",
      placeNameEnglish: edit ? tabData?.placeNameEnglish : "",
      placeNameArabic: edit ? tabData?.placeNameArabic : "",
      siteDescription: edit ? tabData?.siteDescription : "",
      previousNumber: edit ? tabData?.previousNumber : "",
      siteType: edit && tabData?.siteType ? tabData?.siteType : [],
      period: edit && tabData?.period ? tabData?.period : [],
      stateOfConservation:
        edit && tabData?.stateOfConservation?.length > 0
          ? tabData?.stateOfConservation[0]
          : "",
      risk: edit && tabData?.risk?.length > 0 ? tabData?.risk[0] : "",
      tourismValue:
        edit && tabData?.tourismValue.length > 0
          ? tabData?.tourismValue[0]
          : "",
      researchValue:
        edit && tabData?.researchValue?.length > 0
          ? tabData?.researchValue[0]
          : "",
      artifacts:
        edit && tabData?.artifacts?.length > 0 ? tabData?.artifacts[0] : "",
      recommendation: edit ? tabData?.recommendation[0] : "",
      latitude: edit ? tabData?.latitude : null,
      longitude: edit ? tabData?.longitude : null,
      keywords: edit && tabData?.keywords ? tabData?.keywords : [],
    },
    validate: (values) => {
      if (!values.placeNumber) {
        // setFormError('Place Number is required')
      } else {
        // setFormError('')
      }
    },
    onSubmit: (values, { setErrors }) => {
      validation(values, { setErrors })
    },
  });

  useEffect(() => {
    /** Effect needed to load history data,
     * and remove the data when change in add item type window occurs
     */
    if (addItemProgressState && addItemProgressState.formData) {
      setActiveStep(addItemProgressState.activeStep);

      Object.keys(addItemProgressState.formData).forEach((keyName) => {
        // @ts-ignore
        formik.setFieldValue(keyName, addItemProgressState.formData[keyName]);
      });
    }
  }, []);

  return (
    <Box component="div">
      <form onSubmit={formik.handleSubmit}>
        <Box component="div" className={`${styles["add-new-item-container"]}`}>
          <Box component="div" className={`${styles["content-section"]}`}>
            <Box
              component="div"
              className={`${styles["hide-btn"]}`}
              style={{
                marginRight: 0,
                marginLeft: "auto",
                width: "fit-content",
              }}
            >
              <DefaultButton
                variant="text"
                onClick={(e) => handleHide()}
                style={{
                  // paddingInline: 0,
                  minWidth: "fit-content",
                  padding: 0,
                  color: "var(--table-black-text)",
                }}
              >
                Hide
              </DefaultButton>
            </Box>
            <Typography
              className={`${styles["add-title"]}`}
              variant="h4"
              component="h4"
              style={{}}
            >
              {edit ? "Edit" : "Add"} Place
            </Typography>
            <Stepper
              nonLinear
              activeStep={activeStep}
              alternativeLabel
              className={`${styles["stepper"]}`}
            >
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                return (
                  <Step key={label} {...stepProps}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <StepButton color="inherit"
                      onClick={e => {
                        
                        if ((index > activeStep) && edit) {
                          validation(formik.values, { setErrors: formik.setErrors }, true)
                        } else if (index < activeStep) {
                          handleBack()
                        }

                      }}
                    >
                      <StepLabel
                        {...labelProps}
                        className={`${styles["step-label"]}`}
                        StepIconProps={{
                          sx: {
                            ...stepperIconSx,
                          },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
            <>
              <React.Fragment>
                {activeStep == 0 && edit && tabData && (
                  <Box component="div" className={`${styles["visit-count"]}`}>
                    {edit ? `ID ${tabData.id}` : null}
                  </Box>
                )}
                <StepContent
                  tabName={tabName}
                  formState={formState}
                  setFormState={setFormState}
                  activeStep={activeStep}
                  steps={steps}
                  handleNext={handleNext}
                  handleBack={handleBack}
                  formik={formik}
                  options={options}
                  handleClear={handleClear}
                />
              </React.Fragment>
            </>
          </Box>
          <Box
            component="div"
            className={`${styles["btn-row"]}`}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              colors={["#fff", "var(--table-black-text)", "none"]}
              className={`${styles["plain-whitee-btn"]}`}
              label={activeStep === 0 ? "Cancel" : "Back"}
              onClick={handleBack}
              style={{
                paddingInline: 0,
              }}
            />
            <Grid item display={"flex"}>
              {!edit && (
                <Button
                  label={activeStep === steps.length - 1 ? "Add" : "Next"}
                  type="submit"
                // disabled={!(formik.values.placeNumber.length > 0)}
                />
              )}
              {edit && activeStep !== steps.length - 1 && (
                <Button
                  colors={["#fff", "var(--table-black-text)", "none"]}
                  label={"Next"}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => handleNext(e, undefined)}
                />
              )}
              {edit && <Button label={"Update"} type="submit" />}
            </Grid>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default AddNewPlace;
