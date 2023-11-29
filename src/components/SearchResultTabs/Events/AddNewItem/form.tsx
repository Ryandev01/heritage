import {
  Box,
  Button as DefaultButton,
  Grid,
  Typography
} from "@mui/material";
import {
  StepContentTypes,
} from "../../../../types/CustomDrawerTypes";
import styles from "../../Places/AddNewItem/addNewItem.module.css";
import TextInput from "../../../../components/TextInput";
import DropdownComponent from "../../../Dropdown/index";
import AutoCompleteSingleSelect from "../../../AutoComplete/singleSelect";
import AutoComplete from "../../../AutoComplete";
import { SelectChangeEvent } from "@mui/material/Select";
import ReactDatePicker from "react-datepicker";
import { StepperKeywordsComponent } from "../../../StepperKeywordsComponent";
import { validateNumber } from "../../../../utils/services/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

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
  tabName,
  options,
  activeStep,
  steps,
  handleNext,
  handleBack,
  formik,
  places,
  handleChange,
  searchValue,
  setSearchValue
}: StepContentTypes & {searchValue: string, setSearchValue?: (str: string) => void}) => {
  
  const { allPlaces } = useSelector((state: RootState) => state.searchResults);

  return (
    <>
      
      <Box component="div" className={`${styles["form"]}`}>
        {activeStep === 0 && (
          <>
            <AutoCompleteSingleSelect
              className={`${styles["custom-search-field"]}`}
              label="Search Place*"
              placeholder="Search Place*"
              value={formik.values.place || ''}
              handleClear={() => {
                formik.setFieldValue("place", '')
                // if(setSearchValue) setSearchValue('')
              }}
              searchValue={searchValue}
              itemsList={allPlaces || []}
              handleSelectChange={(e, value, r, d) =>
                {
                  formik.setFieldValue("place", value)}
              }
              handleChange={handleChange}
              renderOption={(props, option: any) => (
                <Box
                  component="li"
                  {...props}
                >
                  <Grid container style={{
                    justifyContent: 'space-between'
                  }}>
                    <Grid item sm={10} sx={{ width: '80%' }}>
                      {
                        `${option?.attributes?.placeNameEnglish || ''
                        }${option?.attributes?.placeNameArabic ? ` ${option?.attributes?.placeNameArabic}` : ''
                        }`
                      }
                    </Grid>
                    <Grid item sm={2}>
                      {
                        `${option?.attributes?.placeNumber ? `${option?.attributes?.placeNumber}` : ''
                        }`
                      }
                    </Grid>
                  </Grid>
                </Box>
              )}
              selectStylesSx={commonFormControlSxStyles}
              errorField={
                formik.errors.place ?
                  `${formik.errors.place}`
                  : ''
              }
            />
            <TextInput
              className={`${styles["visit-number"]}`}
              label="Event Number"
              required
              name="visit-number"
              // type="number"
              value={formik.values.visitNumber}
              onChange={(e) => {
                if (validateNumber(e.target.value)) {
                  formik.setFieldValue("visitNumber", e.target.value);
                }
              }}
              sx={{
                ...textInputSxStyles,
                "& .MuiInputBase-inputMultiline": {
                  paddingInline: "0 !important",
                },
              }}
              formControlSx={commonFormControlSxStyles}
              errorField={
                formik.errors.visitNumber ?
                  `${formik.errors.visitNumber}`
                  : ''
              }
            />

            <ReactDatePicker
              placeholderText="Event Date"
              className={`${styles["date"]}`}
              maxDate={new Date()}
              selected={
                formik.values.eventDate && new Date(formik.values.eventDate)
              }
              onChange={(date: Date) => formik.setFieldValue("eventDate", date)}
            />
            <DropdownComponent
              className={`${styles["assessment-type"]}`}
              label={"Assessment Type"}
              name="assessment-type"
              value={formik.values.assessmentType}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue("assessmentType", e.target.value as string)
              }
              itemsList={options?.assessmentType || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            {
              formik.values?.assessmentType &&
              (formik.values.assessmentType === 'Other') &&
              <>
                <TextInput
                  className={`${styles["latitude"]}`}
                  label="Other Assessment"
                  name="Other Assessment"
                  value={formik.values.otherAssessment}
                  onChange={(e) => {
                    formik.setFieldValue("otherAssessment", e.target.value)
                  }}
                  sx={{
                    ...textInputSxStyles,
                    "& .MuiInputBase-inputMultiline": {
                      paddingInline: "0 !important",
                    },
                  }}
                  formControlSx={commonFormControlSxStyles}
                />
              </>
            }
            <TextInput
              className={`${styles["recording-team"]}`}
              label="Recording Team"
              name="recording-team"
              multiline
              minRows={2}
              maxRows={2}
              value={formik.values.recordingTeam}
              onChange={(e) => {
                formik.setFieldValue("recordingTeam", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
                marginBottom: "3em",
                "& .MuiInputBase-inputMultiline": {
                  paddingInline: "0 !important",
                },
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["site-description"]}`}
              label="Site Description"
              name="site-description"
              multiline
              minRows={3}
              maxRows={3}
              value={formik.values.siteDescription}
              onChange={(e) => {
                formik.setFieldValue("siteDescription", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
                marginBottom: "4em",
                "& .MuiInputBase-inputMultiline": {
                  paddingInline: "0 !important",
                },
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <AutoComplete
              className={`${styles["period"]}`}
              label={"Site Type"}
              name="site-type"
              value={formik.values.siteType}
              multiple={true}
              handleClear={() => {}}
              handleSelectChange={(e, value) =>
                formik.setFieldValue("siteType", value)
              }
              itemsList={options?.siteType || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <AutoComplete
              className={`${styles["period"]}`}
              label={"Period"}
              name="period"
              multiple={true}
              value={formik.values.period}
              handleClear={() => {}}
              handleSelectChange={(e, value) =>
                formik.setFieldValue("period", value)
              }
              // handleSChange={(e: SelectChangeEvent<string | string[]>) =>
              //   formik.setFieldValue("period", e.target.value as string)
              // }
              itemsList={options?.period || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["field-narrative"]}`}
              label="Field Narrative"
              name="field-narrative"
              multiline
              minRows={3}
              maxRows={3}
              value={formik.values.fieldNarrative}
              onChange={(e) => {
                formik.setFieldValue("fieldNarrative", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
                marginBottom: "4em",
                "& .MuiInputBase-inputMultiline": {
                  paddingInline: "0 !important",
                },
              }}
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
              itemsList={options?.artifacts || []}
              selectStylesSx={commonSelectSxStyles}
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
                "& .MuiInputBase-inputMultiline": {
                  paddingInline: "0 !important",
                },
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
                "& .MuiInputBase-inputMultiline": {
                  paddingInline: "0 !important",
                },
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <DropdownComponent
              className={`${styles["state-of-conservation"]}`}
              label={"State of conservation"}
              name="stateOfConservation"
              value={formik.values.stateOfConservation}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue(
                  "stateOfConservation",
                  e.target.value as string
                )
              }
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
              itemsList={options?.risk || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />

            <DropdownComponent
              className={`${styles["tourism-value"]}`}
              label={"Tourism Value"}
              name="tourismValue"
              value={formik.values.tourismValue}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue("tourismValue", e.target.value as string)
              }
              itemsList={options?.tourismValue || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <DropdownComponent
              className={`${styles["research-value"]}`}
              label={"Research Value"}
              name="researchValue"
              value={formik.values.researchValue}
              handleChange={(e: SelectChangeEvent<string | string[]>) =>
                formik.setFieldValue("researchValue", e.target.value as string)
              }
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
