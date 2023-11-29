import {
  Box,
  Button as DefaultButton,
} from "@mui/material";
import React, { useState } from "react";
import {
  StepContentTypes,
} from "../../../../types/CustomDrawerTypes";
import {
  handleEnter,
  validateNumber
} from "../../../../utils/services/helpers";
import styles from "./addNewItem.module.css";
import TextInput from "../../../../components/TextInput";
import DropdownComponent from "../../../Dropdown/index";
import { SelectChangeEvent } from "@mui/material/Select";
import AutoComplete from "../../../AutoComplete";
import { StepperKeywordsComponent } from "../../../StepperKeywordsComponent";
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

const StepContent = ({
  activeStep,
  handleClear,
  formik,
  options,
}: StepContentTypes) => {
  const handleSelectChange = (
    e: React.SyntheticEvent,
    value: string[] | [],
    stateName: string
  ) => {
    e.preventDefault();
    formik.setFieldValue(stateName, [
      ...new Set([...formik.values[stateName], ...value]),
    ]);
  };

  return (
    <>
      <Box component="div" className={`${styles["form"]}`}>
        {activeStep === 0 && (
          <>
            <TextInput
              className={`${styles["place-number"]}`}
              label="Place Number"
              name="place-number"
              type="text"
              required
              value={formik.values.placeNumber}
              onChange={(e) => {
                formik.setFieldValue("placeNumber", e.target.value);
              }}
              onKeyDown={(e) => {
                handleEnter(e);
              }}
              sx={{
                ...textInputSxStyles,
                borderColor: formik.errors.placeNumber ? 'red' : 'inherit'
              }}
              formControlSx={commonFormControlSxStyles}
              errorField={
                formik.errors.placeNumber ?
                  `${formik.errors.placeNumber}`
                  : ''
              }
            />
            <TextInput
              lang="en"
              className={`${styles["english-name"]}`}
              label="Name in English"
              name="english-name"
              value={formik.values.placeNameEnglish}
              onChange={(e) => {
                formik.setFieldValue("placeNameEnglish", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["arabic-name"]}`}
              label="Name in Arabic"
              lang="ar"
              name="arabic-name"
              value={formik.values.placeNameArabic}
              onChange={(e) => {
                formik.setFieldValue("placeNameArabic", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["site-description"]}`}
              label="Site Description"
              name="site-description"
              value={formik.values.siteDescription}
              onChange={(e) => {
                formik.setFieldValue("siteDescription", e.target.value);
              }}
              multiline
              minRows={3}
              maxRows={3}
              sx={{
                ...textInputSxStyles,
                marginBottom: "4em",
                "& .MuiInputBase-inputMultiline": {
                  paddingInline: "0 !important",
                },
              }}
              formControlSx={{
                ...commonFormControlSxStyles,
              }}
            />
            <AutoComplete
              className={`${styles["dropdown"]}`}
              label={"Site Type"}
              name="siteType"
              value={formik.values.siteType}
              multiple={true}
              handleSelectChange={(e, value) =>
                formik.setFieldValue("siteType", value) 
              }
              handleChange={() => {}}
              handleClear={(e) => {}}
              itemsList={options?.siteType || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <AutoComplete
              className={`${styles["dropdown"]}`}
              label={"Period"}
              name="period"
              value={[...formik.values.period]}
              multiple={true}
              handleSelectChange={(e, value) =>
                formik.setFieldValue("period", value) 
              }
              handleChange={() => {}}
              handleClear={(e) => {}}
              itemsList={options?.period || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <DropdownComponent
              className={`${styles["artifacts"]}`}
              label={"Artifacts"}
              name="artifacts"
              value={formik.values.artifacts}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue("artifacts", e.target.value as string)
              }
              handleClear={() => {}}
              itemsList={options?.artifacts || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["arabic-name"]}`}
              label="Previous Number"
              name="previousNumber"
              value={formik.values.previousNumber}
              onChange={(e) => {
                formik.setFieldValue("previousNumber", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["latitude"]}`}
              label="Latitude"
              name="latitude"
              value={formik.values.latitude}
              onChange={(e) => {
                if (validateNumber(e.target.value)) {
                  formik.setFieldValue("latitude", e.target.value);
                }
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["longitude"]}`}
              label="Longitude"
              name="longitude"
              value={formik.values.longitude}
              onChange={(e) => {
                if (validateNumber(e.target.value)) {
                  formik.setFieldValue("longitude", e.target.value);
                }
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <DropdownComponent
              className={`${styles["state-of-conservation"]}`}
              label={"State of Conservation"}
              name="state-of-conservation"
              value={formik.values.stateOfConservation}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue(
                  "stateOfConservation",
                  e.target.value as string
                )
              }
              handleClear={() => {}}
              itemsList={options?.stateOfConservation || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <DropdownComponent
              className={`${styles["risk"]}`}
              label={"Risk"}
              name="risk"
              value={formik.values.risk}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue("risk", e.target.value as string)
              }
              handleClear={() => {}}
              itemsList={options?.risk || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <DropdownComponent
              className={`${styles["tourism-value"]}`}
              label={"Tourism Value"}
              name="tourism-value"
              value={formik.values.tourismValue}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue("tourismValue", e.target.value as string)
              }
              handleClear={() => {}}
              itemsList={options?.tourismValue || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <DropdownComponent
              className={`${styles["research-value"]}`}
              label={"Research Value"}
              name="research-value"
              value={formik.values.researchValue}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue("researchValue", e.target.value as string)
              }
              handleClear={() => {}}
              itemsList={options?.researchValue || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <DropdownComponent
              className={`${styles["recommendation"]}`}
              label={"Recommendation"}
              name="recommendation"
              value={formik.values.recommendation}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue("recommendation", e.target.value as string)
              }
              handleClear={() => {}}
              itemsList={options?.recommendation || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
          </>
        )}
        {activeStep === 1 && (
          <>
            <StepperKeywordsComponent
              onKeyDown={(keywordString) => {
                formik.setFieldValue("keywords", [
                  ...new Set([keywordString, ...formik.values.keywords ]),
                ]);
              }}

              onDelete={(value) => {
                const newArr = [...formik.values.keywords].filter(
                  (element: string) => element !== value
                );
                formik.setFieldValue("keywords", [...new Set(newArr)]);
              }}

              currentKeywordArray={formik.values.keywords}

              setCurrentKeywordsArray={(arr: string[]) =>  formik.setFieldValue("keywords", [...new Set(arr)])}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default StepContent;
