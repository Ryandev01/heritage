import {
  Box,
  Button as DefaultButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
  StepButton,
  Chip,
  Grid
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AddNewItemProps,
  StepContentTypes,
} from "../../../../types/CustomDrawerTypes";
import { tabNameProps } from "../../../../types/SearchResultsTabsProps";
import { addItemLibrarySteps, baseUrl, isEmptyValue } from "../../../../utils/services/helpers";
import styles from '../../Places/AddNewItem/addNewItem.module.css'
import Button from "../../../../components/Button";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAddNewItemWindowType, storeAddItemProgressState, toggleAddItemWindowMinimized, toggleAssociationsIconDisabled, toggleAssociationsStepOpen, toggleIsAssociationStepInvalid, toggleNewItemWindow, toggleShowAddSuccess, toggleShowEditSuccess } from "../../../../store/reducers/searchResultsReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useFormik } from "formik";
import FileUpload from "../../../Upload/FileUpload";
import DetachedIcon from "../../../Icons/DetachedIcon";
import AddedPlaces from "../../../AssociationsList/AddedPlaces";
import CloseIcon from '@mui/icons-material/Close';
import AddedEvents from "../../../AssociationsList/AddedEvents";
import axios from 'axios';
import { getToken } from "../../../../utils/storage/storage";
import StepContent from './form';
import { updateKeywords } from "../../../../api/keywords";

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

const AddNewLibraryItem = ({ onHide, create }: AddNewItemProps) => {
  let { tabName } = useParams<{ tabName?: tabNameProps }>();

  const { addItemProgressState,
    associatedPlaces, associatedEvents } = useSelector(
      (state: RootState) => state.searchResults
    );
  const { options } = useSelector((state: RootState) => state.refinedSearch);

  const { edit, tabData } = useSelector((state: RootState) => state.tabEdit);

  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState({
    siteDescription: "",
  });
  const [skipped, setSkipped] = useState(new Set<number>());

  const [steps, setSteps] = useState<Array<string>>(addItemLibrarySteps);

  const dispatch = useDispatch();

  useEffect(() => {

    if (activeStep >= 1) {
      dispatch(toggleAssociationsStepOpen(true));

      if (activeStep > 1) {
        dispatch(toggleAssociationsIconDisabled(true));
      } else {
        dispatch(toggleAssociationsIconDisabled(false));
      }
    } else {
      dispatch(toggleAssociationsStepOpen(false));
    }
  }, [activeStep]);

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  const handleNext = (e: any, data?: any, navigateOnly?: boolean, jumpToStep?: number) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    } else if (
      activeStep === 2
    ) {
      if (
        isEmptyValue(associatedPlaces) &&
        isEmptyValue(associatedEvents)
      ) {
        dispatch(toggleIsAssociationStepInvalid(true))
      } else {
        setActiveStep((prevActiveStep) => jumpToStep && edit ? jumpToStep : prevActiveStep + 1);
      }
    } else {
      setActiveStep((prevActiveStep) => jumpToStep && edit ? jumpToStep : prevActiveStep + 1);
    }

    if (navigateOnly) return

    if (activeStep + 1 === steps.length && data) {
      if (create && !edit) {
        create({
          ...data,
        });
        handleReset()
        updateKeywords({
          keywords: data.keywords
        }, 'library')
        dispatch(toggleNewItemWindow(false))
      }
    }
    if (edit && create && data) {
      create({
        ...data,
      });
      handleReset();
      updateKeywords({
        keywords: data.keywords
      }, 'library')
      dispatch(toggleNewItemWindow(false));
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



  const handleReset = () => {
    setActiveStep(0);

    dispatch(toggleAddItemWindowMinimized(null))

    /** remove the data when change in add item type window occurs */
    dispatch(storeAddItemProgressState(null))


  }

  const handleStep = (step: number) => () => {
    if (activeStep > step) {
      setActiveStep(step);
    }
  };

  const validation = (values: any, formikObject: any, navigateOnly?: boolean, jumpToStep?: number) => {
    let currentError: [] | string[] = [];

    if (!values.title) {
      currentError[0] = "Title is required";
    }

    if (!values.description) {
      currentError[1] = "Description is required";
    }

    if (currentError.length === 0 && (activeStep !== 1)) {
      handleNext(null, values, navigateOnly, jumpToStep);
    } else {
      if (activeStep === 0) {
        if (currentError.length > 0) {

          let obj = {}

          if (currentError[0]) {
            obj = { title: currentError[0] }
          }
          if (currentError[1]) {
            obj = {
              ...obj,
              description: currentError[1]
            }
          }
          formikObject.setErrors(obj)
        }
      }
      else if (
        activeStep === 1
      ) {
        if (
          isEmptyValue(associatedPlaces) &&
          isEmptyValue(associatedEvents)
        ) {
          dispatch(toggleIsAssociationStepInvalid(true))
        } else {
          dispatch(toggleIsAssociationStepInvalid(false))
          handleNext(null, values, navigateOnly, jumpToStep);
        }
      }
      else {
        handleNext(null, values, navigateOnly, jumpToStep);
      }
    }

  }


  const formik = useFormik({
    initialValues: {
      place: "",
      object: edit && tabData?.object ? [tabData?.object] : undefined,
      title: edit ? tabData?.title : '',
      description: edit ? tabData?.description : "",
      referenceURL: edit ? tabData?.referenceURL : "",
      citation: edit ? tabData?.citation : "",
      keywords: [],
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

      setActiveStep(addItemProgressState.activeStep)

      Object.keys(addItemProgressState.formData).forEach(keyName => {
        // @ts-ignore
        formik.setFieldValue(keyName, addItemProgressState.formData[keyName])
      })
    }

  }, [])

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

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const config: any = {
      headers: { "content-type": "multipart/form-data", "authorization": `Bearer ${getToken()}` },
      onUploadProgress: (event: any) => {
        const percent = Math.floor((event.loaded / event.total) * 100);

        onProgress({ percent: (event.loaded / event.total) * 100 });
      }
    };
    fmData.append("files", file, file.name);
    try {

      const res = await axios.post(
        `${baseUrl}/api/upload`,
        fmData,
        config
      );
      formik.values.object = res.data;
      
      if(!formik.values.title) {
        formik.setFieldValue("title", res.data[0].name.split('.')[0]);
      }
      
      onSuccess("Ok");
    } catch (err) {
      console.log("Error: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

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
              {edit ? "Edit" : "Add"} Library
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
                          validation(formik.values, { setErrors: formik.setErrors }, true, index)
                        } else if (index < activeStep) {
                          handleBack()
                        }

                      }}
                    >
                      <StepLabel {...labelProps} className={`${styles['step-label']}`}
                        StepIconProps={{
                          sx: {
                            ...stepperIconSx
                          }
                        }}
                      >{label}
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
                  options={options}
                  formState={formState}
                  setFormState={setFormState}
                  activeStep={activeStep}
                  steps={steps}
                  handleNext={handleNext}
                  formik={formik}
                  handleBack={handleBack}
                  uploadImage={uploadImage}
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
              gap: '1em'
            }}
          >
            <Button
              colors={["#fff", "var(--table-black-text)", "none"]}
              className={`${styles["plain-whitee-btn"]}`}
              label={"Cancel"}
              onClick={(e) => {
                dispatch(toggleNewItemWindow(false))
                dispatch(setAddNewItemWindowType(null))
                handleReset()
              }}
              style={{
                paddingInline: 0,
              }}
            />
            {activeStep > 0 && (
              <Box component="div" style={{
                marginRight: 0,
                marginLeft: 'auto',
              }}>
                <Button
                  label="Back"
                  colors={["#fff", "var(--table-black-text)", "none"]}
                  onClick={handleBack}
                  style={{
                    border: '1px solid var(--table-black-text)',
                  }}
                />
              </Box>
            )}
            <Grid item display={"flex"}>
              {!edit && (
                <Button
                  label={activeStep === steps.length - 1 ? "Add" : "Next"}
                  type="submit"
                />
              )}
              {edit && activeStep !== steps.length - 1 && (
                <Button
                  colors={["#fff", "var(--table-black-text)", "none"]}
                  label={"Next"}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => handleNext(e, undefined)}
                  disabled={formik.values.title.length === 0 && formik.values.description.length === 0}
                />
              )}
              {edit && <Button label={"Update"} disabled={formik.values.title.length === 0 && formik.values.description.length === 0} type="submit" />}
            </Grid>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default AddNewLibraryItem;
