import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  IconButton
} from "@mui/material";
import AutoComplete from "./../AutoComplete";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import styles from "./index.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BaseInputProps, MediaInputProps, RefinedSearchInputProps } from "../../types/RefinedSeachTypes";
import {
  EVENTS_TAB_NAME,
  MEDIA_TAB_NAME,
  tabNameBasedOnIndex,
  validateNumberField,
  validateNumber
} from "../../utils/services/helpers";
import { format } from "date-fns";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import AutoCompleteKeyWordsComponent from "../AutoCompleteKeyWords"
// import { DateRangePicker } from "../DateRangePicker";
import CloseIcon from '@mui/icons-material/Close';

const BaseInputs = ({
  activeTab,
  selectedValue,
  handleChange,
  options,
  commonSelectSxStyles,
  commonFormControlSxStyles,
  handleClear,
  handleSelectChange,
  handleDate,
  textInputSxStyles
}: BaseInputProps) => {
  const [locationModalOpen, toggleLocationModal] = useState<boolean>(false);
  const [dateModalOpen, toggleDateModal] = useState<boolean>(false);
  const [otherAssessment, setOtherAssessment] = useState<string>('');
  const locationInputSx = {
    ...textInputSxStyles,
    "& .MuiInputBase-input.MuiOutlinedInput-input ": {
      paddingInline: "8px",
    },
  }

  return (
    <>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoComplete
          className={`${styles["dropdown"]}`}
          label={"State of Conservation"}
          name="stateOfConservation"
          value={selectedValue.stateOfConservation}
          multiple={true}
          handleSelectChange={(e, value) => handleSelectChange(e, value, 'stateOfConservation')}
          handleChange={() => {}}
          handleClear={(e) => handleClear(e, "stateOfConservation")}
          itemsList={options?.stateOfConservation || []}
          selectStylesSx={commonSelectSxStyles}
          formControlSx={commonFormControlSxStyles}
        />
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoComplete
          className={`${styles["dropdown"]} ${styles["extra-width"]}`}
          label={"Period"}
          name="period"
          value={selectedValue.period}
          multiple={true}
          handleSelectChange={(e, val) => handleSelectChange(e, val, 'period')}
          handleChange={() => {}}
          handleClear={(e) => handleClear(e, "period")}
          itemsList={options?.period || []}
          selectStylesSx={commonSelectSxStyles}
          formControlSx={commonFormControlSxStyles}
        />
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoComplete
          className={`${styles["dropdown"]}`}
          label={"Recommendation"}
          name="recommendation"
          value={selectedValue.recommendation}
          multiple={true}
          handleSelectChange={(e, val) => handleSelectChange(e, val, 'recommendation')}
          handleChange={() => {}}
          handleClear={(e) => handleClear(e, "recommendation")}
          itemsList={options?.recommendation || []}
          selectStylesSx={commonSelectSxStyles}
          formControlSx={commonFormControlSxStyles}
        />
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoComplete
          className={`${styles["dropdown"]}`}
          label={"Research Value"}
          name="researchValue"
          value={selectedValue.researchValue}
          multiple={true}
          handleSelectChange={(e, val) => handleSelectChange(e, val, 'researchValue')}
          handleChange={() => {}}
          handleClear={(e) => handleClear(e, "researchValue")}
          itemsList={options?.researchValue || []}
          selectStylesSx={commonSelectSxStyles}
          formControlSx={commonFormControlSxStyles}
        />
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoComplete
          className={`${styles["dropdown"]} ${styles["extra-width"]}`}
          label={"Tourism Value"}
          name="tourismValue"
          value={selectedValue.tourismValue}
          multiple={true}
          handleSelectChange={(e, val) => handleSelectChange(e, val, 'tourismValue')}
          handleChange={() => {}}
          handleClear={(e) => handleClear(e, "tourismValue")}
          itemsList={options?.tourismValue || []}
          selectStylesSx={commonSelectSxStyles}
          formControlSx={commonFormControlSxStyles}
        />
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoComplete
          className={`${styles["dropdown"]} ${styles["extra-width"]}`}
          label={"Risk"}
          name="risk"
          value={selectedValue.risk}
          multiple={true}
          handleSelectChange={(e, val) => handleSelectChange(e, val, 'risk')}
          handleChange={() => {}}
          handleClear={(e) => handleClear(e, "risk")}
          itemsList={options?.risk || []}
          selectStylesSx={commonSelectSxStyles}
          formControlSx={commonFormControlSxStyles}
        />
      </Grid>
      
      <Grid item sm={2} className={`${styles["location-grid-item"]}`}>
        <Box component="div" className={`${styles["location-popup-relative-wrapper"]}`}>
          <Box component="div"
            onClick={(e) => {
              e.preventDefault();
              toggleLocationModal(!locationModalOpen);
            }}
          >
            <TextInput
              className={`${styles["location"]}`}
              label="Location"
              name="location"
              value={`${selectedValue.latitude}${
                  selectedValue.latitude ? "," : ""
              }${selectedValue.longitude}`}
              onChange={(e) => {}}
              InputProps={{
                endAdornment: <>
                  {
                    (selectedValue.latitude || selectedValue.longitude) &&
                    <InputAdornment position="end" >
                      <IconButton edge="end" onClick={
                        e => {
                          e.stopPropagation()

                          if (validateNumber(selectedValue.latitude)) {
                            handleClear(e, "latitude")
                          }
                          if (validateNumber(selectedValue.longitude)) {
                            setTimeout(() => {
                              handleClear(e, "longitude")
                            }, 10);
                          }
                        }
                      }>
                        <CloseIcon fontSize='small' sx={{
                          marginRight: 0,
                          cursor: 'pointer',
                          zIndex: 6
                        }} />
                      </IconButton>
                    </InputAdornment>
                  }
                </>
              }}
              sx={{
                ...locationInputSx
              }}
              formControlSx={commonFormControlSxStyles}
            />
          </Box>
          {locationModalOpen && (
            <>
              <Grid
                container
                className={`${styles["location-popup-container"]}`}
              >
                {/* <HighlightOffIcon
                  className={`${styles["location-popup-close"]}`}
                  style={{}}
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   toggleLocationModal(false);
                  // }}
                /> */}
                <Grid item sm={6}>
                  <TextInput
                    className={`${styles["latitude"]}`}
                    label="Latitude"
                    name="latitude"
                    value={selectedValue.latitude}
                    onKeyDown={e => {
                      validateNumberField(e)
                    }}
                    InputProps={{
                      inputMode: 'numeric', pattern: /^(\d+(\.\d+)?)$/ 
                    }}
                    onChange={(e) => {
                      if (validateNumber(e.target.value)) {
                        handleChange(e)
                      }
                    }}
                    sx={{
                      ...locationInputSx
                    }}
                    formControlSx={commonFormControlSxStyles}
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextInput
                    className={`${styles["longitude"]}`}
                    label="Longitude"
                    name="longitude"
                    value={selectedValue.longitude}
                    onKeyDown={e => {
                      validateNumberField(e)
                    }}
                    InputProps={{
                      inputMode: 'numeric', pattern: /^(\d+(\.\d+)?)$/ 
                    }}
                    onChange={(e) => {
                      if (validateNumber(e.target.value)) {
                        handleChange(e)
                      }
                    }}
                    sx={{
                      ...locationInputSx
                    }}
                    formControlSx={commonFormControlSxStyles}
                  />
                </Grid>
                <Grid item></Grid>
              </Grid>
            </>
          )}
        </Box>
      </Grid>
      {activeTab === EVENTS_TAB_NAME && (
        <>
          <Grid item sm={2} className={`${styles["input-field"]}`}>
            <AutoComplete
              className={`${styles["dropdown"]}`}
              label={"Assessment"}
              name="assessmentType"
              value={selectedValue.assessmentType}
              multiple={true}
              handleSelectChange={(e, val) => handleSelectChange(e, val, 'assessmentType')}
              handleChange={() => { }}
              handleClear={(e) => handleClear(e, "assessmentType")}
              itemsList={options?.assessmentType || []}
              selectStylesSx={{
                ...commonSelectSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
          </Grid>
          {
            selectedValue?.assessmentType[0] &&
            (selectedValue.assessmentType[0] === 'Other') &&
            <>
              <Grid item sm={2} className={`${styles["input-field"]}`}>
                <TextInput
                  lang="en"
                  className={`${styles["dropdown"]}`}
                  label="Other Assessment"
                  name="other-assessment"
                  value={otherAssessment}
                  onChange={(e) => {
                    setOtherAssessment(e.target.value)
                  }}
                  sx={{
                    ...textInputSxStyles,
                  }}
                  formControlSx={commonFormControlSxStyles}
                />
              </Grid>
            </>
          }
       </>
      )}
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoComplete
          className={`${styles["dropdown"]} ${styles["extra-width"]}`}
          label={"Artifacts"}
          name="artifacts"
          value={selectedValue.artifacts}
          multiple={true}
          handleSelectChange={(e, val) => handleSelectChange(e, val, 'artifacts')}
          handleChange={() => {}}
          handleClear={(e) => handleClear(e, "artifacts")}
          itemsList={options?.artifacts || []}
          selectStylesSx={commonSelectSxStyles}
          formControlSx={commonFormControlSxStyles}
        />
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoCompleteKeyWordsComponent />
      </Grid>
      {activeTab === EVENTS_TAB_NAME && 
        <Grid item sm={4} className={`${styles["input-field"]} ${styles["date-input-field"]}`}>
          <Box component="div"
            onClick={(e) => {
              e.preventDefault();
              toggleDateModal(!dateModalOpen);
            }}
          >
            <TextInput
              className={`${styles["date-input-box"]}`}
              label="Date Range"
              name="date range"
              value={selectedValue.startDate && selectedValue.endDate ? `${
                selectedValue.startDate ? format(
                  new Date(selectedValue.startDate),
                  "MM/dd/yyyy"
                ) : ''
              } ${selectedValue.endDate ? `- ${format(
                  new Date(selectedValue.endDate),
                  "MM/dd/yyyy"
                )}` : ''}` : ''}
              onChange={(e) => { }}
              sx={{
                ...locationInputSx,
                "& .MuiInputBase-input.MuiOutlinedInput-input": {
                  fontSize: '1em'
                }
              }}
              formControlSx={{
                ...commonFormControlSxStyles,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{
                    marginLeft: '-8px'
                  }}>
                    {(selectedValue.startDate || selectedValue.endDate) ? <IconButton
                      aria-label="CalendarTodayIcon"
                      edge="end"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDate(null, "clearDate");
                        // toggleDateModal(!dateModalOpen);
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton> : <IconButton
                      aria-label="CalendarTodayIcon"
                      edge="end"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDateModal(!dateModalOpen);
                      }}
                    >
                      <CalendarTodayOutlinedIcon fontSize="small" sx={{
                        color: '#000'
                      }} />
                    </IconButton>}
                  </InputAdornment>
                )
              }}
            />
          </Box>
          {dateModalOpen && (
            
            // might be needed later
            // <>
            //   <DateRangePicker />
            // </>
            <>
              <Grid
                container
                className={`${styles["date-popup-container"]}`}
              >
                <Grid item sm={6} className={`${styles["date-popup-grid-item"]}`}>
                  <DatePicker
                    maxDate={new Date()}
                    placeholderText="From Date"
                    className={`${styles["date"]} ${styles["date-subinput"]}`}
                    selected={selectedValue.startDate && new Date(selectedValue.startDate)}
                    onChange={(date: Date) => handleDate(date, "startDate")}
                  />
                </Grid>
                <Grid item sm={6} className={`${styles["date-popup-grid-item"]}`}>
                  <DatePicker
                    placeholderText="To Date"
                    className={`${styles["date"]} ${styles["date-subinput"]}`}
                    selected={selectedValue.endDate && new Date(selectedValue.endDate)}
                    minDate={selectedValue.startDate && new Date(selectedValue.startDate)}
                    maxDate={new Date()}
                    onChange={(date: Date) => handleDate(date, "endDate")}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      }
    </>
  );
};

const MediaInputs = ({
  selectedValue,
  handleChange,
  options,
  commonSelectSxStyles,
  commonFormControlSxStyles,
  handleClear,
  handleSelectChange,
  textInputSxStyles
}: MediaInputProps) => {
  const [locationModalOpen, toggleLocationModal] = useState<boolean>(false);

  const locationInputSx = {
    ...textInputSxStyles,
    "& .MuiInputBase-input.MuiOutlinedInput-input ": {
      paddingInline: "8px",
    },
  }
  
  return (
    <>
      <Grid item sm={2} className={`${styles["location-grid-item"]}`}>
        <Box component="div">
          <Box component="div"
            onClick={(e) => {
              e.preventDefault();
              toggleLocationModal(!locationModalOpen);
            }}
          >
            <TextInput
              className={`${styles["location"]}`}
              label="Location"
              name="location"
              value={`${selectedValue.latitude}${selectedValue.latitude ? "," : ""
                }${selectedValue.longitude}`}
              onChange={(e) => { }}
              sx={{
                ...locationInputSx
              }}
              InputProps={{
                endAdornment: <>
                  {
                    (selectedValue.latitude || selectedValue.longitude) &&
                    <InputAdornment position="end" >
                      <IconButton edge="end" onClick={
                        e => {
                          e.stopPropagation()

                          if (validateNumber(selectedValue.latitude)) {
                            handleClear(e, "latitude")
                          }
                          if (validateNumber(selectedValue.longitude)) {
                            setTimeout(() => {
                              handleClear(e, "longitude")
                            }, 10);
                          }

                        }
                      }>
                        <CloseIcon fontSize='small' sx={{
                          marginRight: 0,
                          cursor: 'pointer',
                          zIndex: 6
                        }} />
                      </IconButton>
                    </InputAdornment>
                  }
                </>
              }}
              formControlSx={commonFormControlSxStyles}
            />
          </Box>
          {locationModalOpen && (
            <>
              <Grid
                container
                className={`${styles["location-popup-container"]}`}
              >
                {/* <HighlightOffIcon
                  className={`${styles["location-popup-close"]}`}
                  style={{}}
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   toggleLocationModal(false);
                  // }}
                /> */}
                <Grid item sm={6}>
                  <TextInput
                    className={`${styles["latitude"]}`}
                    label="Latitude"
                    name="latitude"
                    value={selectedValue.latitude}
                    onKeyDown={e => {
                      validateNumberField(e)
                    }}
                    InputProps={{
                      inputMode: 'numeric', pattern: /^(\d+(\.\d+)?)$/ 
                    }}
                    onChange={(e) => {
                      if (validateNumber(e.target.value)) {
                        handleChange(e)
                      }
                    }}
                    sx={{
                      ...locationInputSx,
                    }}
                    formControlSx={commonFormControlSxStyles}
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextInput
                    className={`${styles["longitude"]}`}
                    label="Longitude"
                    name="longitude"
                    value={selectedValue.longitude}
                    onKeyDown={e => {
                      validateNumberField(e)
                    }}
                    InputProps={{
                      inputMode: 'numeric', pattern: /^(\d+(\.\d+)?)$/ 
                    }}
                    onChange={(e) => {
                      if (validateNumber(e.target.value)) {
                        handleChange(e)
                      }
                    }}
                    sx={{
                      ...locationInputSx,
                    }}
                    formControlSx={commonFormControlSxStyles}
                  />
                </Grid>
                <Grid item></Grid>
              </Grid>
            </>
          )}
        </Box>
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoComplete
          className={`${styles["dropdown"]} ${styles["extra-width"]}`}
          label={"Category Type"}
          name="actionType"
          value={selectedValue.actionType}
          multiple={true}
          handleSelectChange={(e, val) => handleSelectChange(e, val, 'actionType')}
          handleChange={() => {}}
          handleClear={(e) => handleClear(e, "actionType")}
          itemsList={options?.actionType || []}
          selectStylesSx={commonSelectSxStyles}
          formControlSx={commonFormControlSxStyles}
        />
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <AutoCompleteKeyWordsComponent />
      </Grid>
      <Grid item sm={2} className={`${styles["input-field"]}`}>
        <FormGroup className={`${styles["black-90-pct"]}`}>
          <FormControlLabel
            style={{
              accentColor: "red",
            }}
            control={
              <Checkbox
                sx={{
                  color: "var(--grey-text)",
                  "&.Mui-checked": {
                    color: "var(--grey-text)",
                  },
                }}
              />
            }
            name="featuredImage"
            label="Featured Image"
            onChange={(e: any, checked) => handleChange(e, checked)}
          />
        </FormGroup>
      </Grid>
    </>
  );
};


const RefinedSearchInputs = ({
  activeTabIndex,
  options,
  handleChange,
  selectedValue,
  handleSubmit,
  handleClear,
  handleDate,
  handleSelectChange
}: RefinedSearchInputProps) => {
  const commonSelectSxStyles = {
    textAlign: "left",
    "& .MuiSelect-select": {
      padding: "0.5em 1em",
      color: "var(--grey-text)",
    },
  };
  const commonFormControlSxStyles = {
    width: "100%",
    flexGrow: 0,
    "& .MuiInputBase-root": {
      backgroundColor: "#fff",
      border: "1px solid var(--lightest-border)",
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
      height: "1.3em",
    },
    "& .MuiOutlinedInput-notchedOutline span": {
      opacity: 1,
    },
    "& .MuiOutlinedInput-notchedOutline legend": {
      color: "transparent",
    },
  };


  const activeTab: string = tabNameBasedOnIndex(activeTabIndex);
  
  return (
    <Box component="div"
      className={`refined-inputs-container ${styles["refined-inputs-container"]}`}
    >
      <Grid container className={`${styles["refined-inputs-grid"]}`}>
        {activeTab !== MEDIA_TAB_NAME &&
          <BaseInputs
            activeTab={activeTab}
            selectedValue={selectedValue}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            options={options}
            commonSelectSxStyles={commonSelectSxStyles}
            commonFormControlSxStyles={commonFormControlSxStyles}
            handleClear={handleClear}
            handleDate={handleDate}
            textInputSxStyles={textInputSxStyles}
          />
        }
        {activeTab === MEDIA_TAB_NAME &&
          <MediaInputs
            selectedValue={selectedValue}
            handleChange={handleChange}
            options={options}
            commonSelectSxStyles={commonSelectSxStyles}
            commonFormControlSxStyles={commonFormControlSxStyles}
            handleClear={handleClear}
            handleSelectChange={handleSelectChange}
            textInputSxStyles={textInputSxStyles}
          />
        }
        <Grid item>
          <Button
            label="SEARCH"
            onClick={handleSubmit}
            colors={[
              "transparent",
              "var(--black-90-pct)",
              "rgb(0 0 0) 0px 0px 2px -1px",
            ]}
            style={{
              padding: "0 2em",
              width: "100%",
            }}
          />
        </Grid>
        {/* <Grid item>
                    <Button label="Reset" colors={['#000', '#fff', 'none']} style={{
                        padding: '0 2em',
                        textTransform: 'unset'
                    }} />
                </Grid> */}
      </Grid>
    </Box>
  );
};

export default RefinedSearchInputs;
