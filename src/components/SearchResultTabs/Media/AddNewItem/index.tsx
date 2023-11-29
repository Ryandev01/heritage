import {
  Box,
  Grid,
  Button as DefaultButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
  StepButton,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AddNewItemProps,
} from "../../../../types/CustomDrawerTypes";
import { tabNameProps } from "../../../../types/SearchResultsTabsProps";
import {
  allowedVideoFormats,
  isEmptyValue,
  MEDIA_TAB_NAME,
} from "../../../../utils/services/helpers";
import styles from "../../Places/AddNewItem/addNewItem.module.css";
import Button from "../../../../components/Button";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setAddNewItemWindowType,
  toggleAddItemWindowMinimized,
  toggleNewItemWindow,
  toggleShowAddSuccess,
  toggleAssociationsStepOpen,
  storeAddItemProgressState,
  toggleAssociationsIconDisabled,
  toggleShowEditSuccess,
  toggleIsAssociationStepInvalid,
} from "../../../../store/reducers/searchResultsReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { addItemMediaSteps, baseUrl } from "./../../../../utils/services/helpers";
import { useFormik } from "formik";
import StepContent from './form';
import axios from 'axios';
import { getToken } from "../../../../utils/storage/storage";
import { updateKeywords } from "../../../../api/keywords";

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

const AddNewMedia = ({ onHide, create }: AddNewItemProps) => {
  let { tabName } = useParams<{ tabName?: tabNameProps }>();
  const { options } = useSelector((state: RootState) => state.refinedSearch);

  const { associatedPlaces, associatedEvents, addItemProgressState } = useSelector(
    (state: RootState) => state.searchResults
  );
  const { edit, tabData } = useSelector((state: RootState) => state.tabEdit);
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState({
    siteDescription: "",
  });
  const [skipped, setSkipped] = useState(new Set<number>());
  const [formError, setFormError] = useState<string>("");

  const getSteps = () => {
    return addItemMediaSteps;
    // if (tabName === MEDIA_TAB_NAME) {
    //     return addItemMediaSteps
    // } else {
    //     return addItemDefaultSteps
    // }
  };

  const [steps, setSteps] = useState<Array<string>>(getSteps());

  const dispatch = useDispatch();

  let mediaInitialValue = {
    media_type: edit ? tabData?.media_type[0]?.typeCode : "",
    title: edit ? tabData.title : "",
    bearing: edit ? tabData.bearing : "",
    description: edit ? tabData.description : "",
    Author: edit ? tabData.Author : "",
    categoryType: edit ? tabData?.categoryType : [],
    latitude: edit ? tabData?.latitude : null,
    longitude: edit ? tabData?.longitude : null,
    referenceURL: edit ? tabData?.referenceURL : "",
    citation: edit ? tabData?.citation : "",
    keywords: edit && tabData?.keywords ? tabData?.keywords : [],
    object: edit && tabData?.object ? [tabData?.object] : undefined,
    mediaType: "",
    refrenceUrl: "",
    showEmbeded: Boolean(edit && tabData?.objectURL && (tabData?.videoType === 'embededCode')),
    embedCode: edit && tabData?.objectURL,
    submitEmbed: edit ? true : false,
    showUrl: Boolean(edit && (
      tabData?.referenceURL || 
      (
        tabData?.objectURL && (tabData?.videoType === 'url')
      )
      )),
    url: edit ? (tabData?.referenceURL ? tabData?.referenceURL :  (
      tabData?.objectURL && (tabData?.videoType === 'url') ? tabData?.objectURL : ''
    )): "",
    valid: edit ? true : false,
    errorUrl: '',
    associationError: ''
  }


  useEffect(() => {

    if (activeStep >= 2) {
      dispatch(toggleAssociationsStepOpen(true));

      if (activeStep > 2) {
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

  const handleNext = (e: any, data: any, navigateOnly?: boolean, jumpToStep?: number) => {
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
        handleReset();
        updateKeywords({
          keywords: data.keywords
        }, 'media')
        dispatch(toggleShowAddSuccess(true));
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
      }, 'media')
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

    if (currentError.length === 0 && (activeStep !== 2)) {
      handleNext(null, values, navigateOnly , jumpToStep);
    } else {
      if (activeStep === 1) {

        if (currentError.length > 0) {

          let obj = {}

          if (currentError[0]) {
            obj = { title: currentError[0] }
          }
          formikObject.setErrors(obj)
        }
      }
      else if (
        activeStep === 2
      ) {
        if (
          isEmptyValue(associatedPlaces) &&
          isEmptyValue(associatedEvents)
        ) {
          dispatch(toggleIsAssociationStepInvalid(true))
        } else {
          dispatch(toggleIsAssociationStepInvalid(false))
          handleNext(null, values, navigateOnly , jumpToStep);
        }
      }
      else {
        handleNext(null, values, navigateOnly);
      }
    }
  }

  const formik = useFormik({
    initialValues: mediaInitialValue,
    validate: (values) => {
      if (!values.title && activeStep == 1) {
        setFormError("Image Title is required");
      } else if ((associatedPlaces.length === 0 || associatedEvents.length === 0) && activeStep === 2) {
        setFormError("Please create atleast one association");
      } else {
        setFormError("");
      }
    },
    onSubmit: (values, { setErrors }) => {
      validation(values, { setErrors })
    },
  });


  const [disableNext, setDisableNext] = useState<boolean>(false)

  useEffect(() => {
    setDisableNext(
      (activeStep === 0) && 
      (!formik.values.valid)  // check if all media formats are validated after upload
    )

  }, [formik, activeStep])

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

    if (
      (formik.values.media_type === "VIDEO") &&
      allowedVideoFormats.every(item => file.type?.toLowerCase().indexOf(item.toLowerCase()) === -1)
    ) {
      file.status = "error"
      file.response = "Format not supported."
      formik.setFieldValue("valid", false);

      onError({ message: 'Format not supported.' });
      return
    } 

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
      formik.setFieldValue("valid", true);
      onSuccess("Ok");
    } catch (err) {
      console.log("Eroor: ", err);
      formik.setFieldValue("valid", false);
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
              {edit ? "Edit" : "Add"} Media
            </Typography>
            <Stepper
              nonLinear
              activeStep={activeStep}
              alternativeLabel
              className={`${styles["stepper"]} ${tabName === MEDIA_TAB_NAME ? styles["add-media-stepper"] : ""
                } ${styles["media-stepper"]}`}
            >
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                // if (isStepOptional(index)) {
                //     labelProps.optional = (
                //         <Typography variant='caption'>Optional</Typography>
                //     );
                // }
                // if (isStepSkipped(index)) {
                //     stepProps.completed = false;
                // }
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
                  options={options}
                  formik={formik}
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
              label="Cancel"
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
                disabled={disableNext}
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

export default AddNewMedia;
