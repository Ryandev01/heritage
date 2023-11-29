import { Box, Typography, Button as DefaultButton } from "@mui/material";
import React, { useState } from "react";
import { StepContentTypes } from "../../../../types/CustomDrawerTypes";
import Button from "../../../../components/Button";
import styles from "../../Places/AddNewItem/addNewItem.module.css";
import TextInput from "../../../../components/TextInput";
import DropdownComponent from "../../../Dropdown/index";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ASSOCIATIONS_MANDATORY_ERR_MESSAGE, baseUrl, get_youtube_thumbnail, replaceWatchWithEmbed, validateNumber } from "./../../../../utils/services/helpers";
import CustomUpload from "../../../Upload/ImageUpload";
import { SelectChangeEvent } from "@mui/material/Select";
import AutoComplete from "../../../AutoComplete";
import ReactPlayer from "react-player";
import DetachedIcon from "../../../Icons/DetachedIcon";
import AddedPlaces from "../../../AssociationsList/AddedPlaces";
import AddedEvents from "../../../AssociationsList/AddedEvents";
import { StepperKeywordsComponent } from "../../../StepperKeywordsComponent";
import FormError from "../../../FormError";
import type { UploadFile } from 'antd/es/upload/interface';
import NoVideoPresent from "../../../NoDataScreens/NoVideoPresent";

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

const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/watch\?v=([^&]+)/m;

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

const HandleUrl = ({
  formik
}: { formik: any }) => {

  const [errorInShowingThumnail, setErrorInShowingThumbnail] = useState<boolean>(false)

  return (
    // <iframe
    //   width="338"
    //   height="190"
    //   onError={(e) => {
    //     console.log(e, "error")
    //     alert('YESS')
    //     setErrorInShowingThumbnail(true)
    //   }}
    //   src={replaceWatchWithEmbed(formik.values.url)}
    //   // srcDoc={
    //   //   `<div classname="${styles["no-preview-url"]}" > <img src="${get_youtube_thumbnail(formik.values.url, "high")}" width="100%" height="100%" /></div>`
    //   // }
    //   title="YouTube video player"
    //   frameBorder="0"
    //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //   allowFullScreen
    // ></iframe>
    <ReactPlayer
      width="100%" height="100%"
      playing={false}
      controls={true}
      url={formik.values.url}
      style={{
        aspectRatio: '3/2'
      }}
    />
  );
};


const StepContent = ({
  uploadImage,
  tabName,
  formState,
  setFormState,
  activeStep,
  steps,
  handleNext,
  handleBack,
  options,
  formik,
}: StepContentTypes) => {
  const { associatedPlaces, associatedEvents, isAssociationStepInvalid } = useSelector(
    (state: RootState) => state.searchResults
  );
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
  const objectURL = `<iframe
width="338"
height="190"
src="https://www.youtube.com/embed/C8AYzPxr_SE"
title="YouTube video player"
frameBorder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowFullScreen
></iframe>`;
  const handleEmbed = (data: string) => {
    return <div dangerouslySetInnerHTML={{ __html: data }} />;
  };


  const renderEmbedSubmitButton = () => {
    return (
      <>
        {formik.values?.embedCode && (
          <Box component={"div"} className={`${styles["embed-submit-button"]}`}>
            <Button
              colors={["#fff", "var(--table-black-text)"]}
              variant="outlined"

              label={"EMBED"}
              onClick={() => {
                formik.setFieldValue("submitEmbed", true)
                formik.setFieldValue("valid", true)
              }}
            />
          </Box>
        )}
      </>
    )
  }

  const validateUrl = (str: string) => {
    // const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    const regex = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
    if (regex.test(str)) {
      formik.setFieldValue("valid", true);
      formik.setFieldValue("objectURL", str);
      formik.setFieldValue("errorUrl", '');
    } else {
      formik.setFieldValue("valid", false);
      formik.setFieldValue("errorUrl", 'Invalid Url');
    }
  }

  const handleDropdown = (e: string | string[]) => {
    formik.setFieldValue("media_type", e);
    if (typeof e === 'string' && e.toLowerCase() === 'image') {
      formik.setFieldValue("url", '');
      formik.setFieldValue("objectUrl", "");
      formik.setFieldValue("showUrl", false);
      formik.setFieldValue("embedCode", '');
      formik.setFieldValue("showEmbeded", false);
      formik.setFieldValue("submitEmbed", false);
      formik.setFieldValue("valid", false);
    }
    else if (typeof e === 'string' && e.toLowerCase() === 'video') {
      formik.setFieldValue("object", undefined);
      formik.setFieldValue("url", '');
      formik.setFieldValue("objectUrl", "");
      formik.setFieldValue("showUrl", false);
      formik.setFieldValue("embedCode", '');
      formik.setFieldValue("showEmbeded", false);
      formik.setFieldValue("submitEmbed", false);
      formik.setFieldValue("valid", false);
    }
    else if (typeof e === 'string' && e.toLowerCase() === '3dmodel') {
      formik.setFieldValue("object", undefined);
      formik.setFieldValue("url", '');
      formik.setFieldValue("objectUrl", "");
      formik.setFieldValue("showUrl", false);
      formik.setFieldValue("embedCode", '');
      formik.setFieldValue("showEmbeded", false);
      formik.setFieldValue("submitEmbed", false);
      formik.setFieldValue("valid", false);
    }
  }

  return (
    <>
      <Box component="div" className={`${styles["form"]}`}>
        {activeStep === 0 && (
          <>
            <DropdownComponent
              className={`${styles["media-type"]}`}
              label={"Media Type"}
              name="media-type"
              value={formik.values.media_type}
              // handleChange={(e) => setFormState((state: any) => ({
              //     ...state,
              //     media_type: e.target.value
              // }))}

              handleChange={(e: SelectChangeEvent<string | string[]>) => {
                handleDropdown(e.target.value)
              }}
              handleClear={(e: React.MouseEvent) => { }}
              itemsList={[
                {
                  label: "Image",
                  value: "IMAGE",
                },
                {
                  label: "Video",
                  value: "VIDEO",
                },
                {
                  label: "3D Model",
                  value: "3DMODEL",
                },
              ]}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />

            {formik.values?.media_type.toLowerCase() === "image" && (
              <>
                <CustomUpload
                  defaultImages={formik.values.object}
                  uploadImage={uploadImage}
                  accept={".jpg,.jpeg,.png,.bmp,.gif"}
                  title={"Drag and drop your file here"}
                  existingImageUrl={
                    (formik.values?.object && formik.values?.object.length > 0 && formik.values?.object[0]?.url)
                      ? `${formik.values?.object[0]?.url}`
                      : ""
                  }
                  handleDelete={(file: UploadFile<any>) => {
                    formik.setFieldValue("object", []);
                  }}
                />
                <Typography className={`${styles['file-upload-bottom-text']}`}>Accepted file types: .jpg, .png</Typography>
              </>
            )}
            {formik.values?.media_type.toLowerCase() === "video" && (
              <>
                {formik.values.showEmbeded ? (
                  <>
                    {formik.values.submitEmbed ? (
                      <Box
                        component={"div"}
                        className={`${styles["video-box"]}`}
                      >
                        {handleEmbed(formik.values.embedCode)}
                        <Typography
                          className={`${styles["file-upload-url-bottom-text"]}`}
                        >
                          YouTube video player
                        </Typography>
                      </Box>
                    ) : (
                      <TextInput
                        // className={`${styles["english-name"]}`}
                        label="Embed Code"
                        name="embedCode"
                        multiline
                        minRows={8}
                        maxRows={8}
                        value={formik.values.embedCode}
                        onChange={(e) => {
                          formik.setFieldValue("embedCode", e.target.value);
                        }}
                        sx={{
                          ...textInputSxStyles,
                          marginBottom: "8em",
                          height: '90px',
                          "& .MuiInputBase-inputMultiline": {
                            paddingInline: "0 !important",
                          }
                        }}
                        formControlSx={{
                          ...commonFormControlSxStyles,
                        }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {formik.values.showUrl ? (
                      <>
                        <TextInput
                          className={`${styles["english-name"]}`}
                          label="URL"
                          name="url"
                          value={formik.values.url}
                          onChange={(e) => {
                            formik.setFieldValue("url", e.target.value);
                          }}
                          sx={{
                            ...textInputSxStyles,
                          }}
                          formControlSx={commonFormControlSxStyles}
                          error={formik.values.errorUrl?.length > 0}
                          errorText={formik.values.errorUrl}
                        />
                        {!formik.values.valid && formik.values.url?.length > 0 &&
                        <Box component={"div"} className={`${styles["embed-submit-button"]}`}>
                          <Button
                            colors={["#fff", "var(--table-black-text)"]}
                            variant="outlined"

                            label={"VALIDATE"}
                            onClick={() => {
                              validateUrl(formik.values.url)
                            }}
                          />
                        </Box>}
                        {formik.values.valid && (
                          <Box
                            component={"div"}
                            className={`${styles["video-box"]}`}
                          >
                            <HandleUrl
                              formik={formik}
                            />
                            <Typography
                              mt={1}
                              className={`${styles["file-upload-url-bottom-text"]}`}
                            >
                              YouTube video player
                            </Typography>
                          </Box>
                        )}
                      </>
                    ) : (
                      <>
                        {formik.values?.object && formik.values?.object[0]?.url ?
                          <>
                            <video width="338" height="190" controls preload="metadata">
                              <source
                                // src={`${baseUrl}${formik.values.object[0].url}`}
                                src={`${formik.values.object[0].url}#t=0.5`}
                              // type="video/mp4"
                              />

                            </video>
                            <CustomUpload
                              accept={'video/*, audio/ogg'}
                              defaultImages={formik.values.object}
                              uploadImage={uploadImage}
                              title={"Drag and drop your file here"}
                              existingImageUrl={""}
                              handleDelete={() => {
                                formik.setFieldValue("object", []);
                              }}
                            />
                            <Typography className={`${styles['file-upload-bottom-text']}`}>Accepted file types: .mp4, .webm, .ogg</Typography>
                          </> :
                          <>
                            <CustomUpload
                              accept={'video/*, audio/ogg'}
                              defaultImages={formik.values.object}
                              uploadImage={uploadImage}
                              title={"Drag and drop your file here"}
                              existingImageUrl={""}
                              handleDelete={() => {
                                console.log('inside delete');
                                formik.setFieldValue("object", []);
                              }}
                            />
                            <Typography className={`${styles['file-upload-bottom-text']}`}>Accepted file types: .mp4, .webm, .ogg</Typography>
                          </>
                        }
                      </>
                    )}
                  </>
                )}

                {formik.values.submitEmbed ? null : renderEmbedSubmitButton()}
                <Typography
                  onClick={() => {
                    formik.setFieldValue(
                      "showEmbeded",
                      !formik.values.showEmbeded
                    );
                    formik.setFieldValue("showUrl", false);
                    formik.setFieldValue("url", '');
                    formik.setFieldValue("objectUrl", "");
                    formik.setFieldValue("object", undefined);
                    formik.setFieldValue("valid", false);
                    formik.setFieldValue("submitEmbed", false);
                  }}
                  className={`${styles["file-upload-url-bottom-text"]}`}
                >
                  {formik.values.showEmbeded
                    ? "Upload video instead"
                    : "Add embed code instead"}
                </Typography>
                <Typography
                  className={`${styles["file-upload-url-bottom-text"]}`}
                >
                  or
                </Typography>
                <Typography
                  className={`${styles["file-upload-url-bottom-text"]}`}
                  onClick={() => {
                    formik.setFieldValue("showEmbeded", false);
                    formik.setFieldValue("embedCode", "");
                    formik.setFieldValue("showUrl", !formik.values.showUrl);
                    formik.setFieldValue("url", '');
                    formik.setFieldValue("objectUrl", "");
                    formik.setFieldValue("object", undefined);
                    formik.setFieldValue("valid", false);
                  }}
                >
                  Add URL
                </Typography>
              </>
            )}
            {formik.values?.media_type.toLowerCase() === "3dmodel" && (
              <>
                {formik.values.submitEmbed ? (
                  <Box component={"div"} className={`${styles["embed-box"]}`}>
                    {handleEmbed(formik.values.embedCode)}
                  </Box>
                ) : (
                  <TextInput
                    // className={`${styles["english-name"]}`}
                    label="Embed Code"
                    name="embedCode"
                    multiline
                    minRows={8}
                    maxRows={8}
                    value={formik.values.embedCode}
                    onChange={(e) => {
                      formik.setFieldValue("embedCode", e.target.value);
                    }}
                    sx={{
                      ...textInputSxStyles,
                      marginBottom: "8em",
                      height: '90px',
                      "& .MuiInputBase-inputMultiline": {
                        paddingInline: "0 !important",
                      }
                    }}
                    formControlSx={{
                      ...commonFormControlSxStyles,
                      
                    }}
                  />
                )}
                {formik.values.submitEmbed ? null : renderEmbedSubmitButton()}
              </>
            )}
          </>
        )}
        {activeStep === 1 && (
          <>
            <TextInput
              required
              className={`${styles["english-name"]}`}
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={(e) => {
                formik.setFieldValue("title", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
              errorField={
                formik.errors.title ?
                  `${formik.errors.title}`
                  : ''
              }
            />
            <TextInput
              className={`${styles["site-description"]}`}
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={(e) => {
                formik.setFieldValue("description", e.target.value);
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
            <TextInput
              className={`${styles["english-name"]}`}
              label="Bearing"
              name="bearing"
              value={formik.values.bearing}
              onChange={(e) => {
                formik.setFieldValue("bearing", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["english-name"]}`}
              label="Author"
              name="Author"
              value={formik.values.Author}
              onChange={(e) => {
                formik.setFieldValue("Author", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <AutoComplete
              className={`${styles["dropdown"]}`}
              label={"Category Type"}
              name="categoryType"
              value={formik.values.categoryType}
              multiple={true}
              handleSelectChange={(e, value) =>
                formik.setFieldValue("categoryType", value)
              }
              handleClear={(e) => { }}
              itemsList={options?.actionType || []}
              selectStylesSx={commonSelectSxStyles}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["english-name"]}`}
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
            <TextInput
              className={`${styles["english-name"]}`}
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
              className={`${styles["english-name"]}`}
              label="Reference URL"
              name="referenceURL"
              value={formik.values.referenceURL}
              onChange={(e) => {
                formik.setFieldValue("referenceURL", e.target.value);
              }}
              sx={{
                ...textInputSxStyles,
              }}
              formControlSx={commonFormControlSxStyles}
            />
            <TextInput
              className={`${styles["citation"]}`}
              label="Citation"
              name="citation"
              multiline
              minRows={3}
              maxRows={3}
              value={formik.values.citation}
              onChange={(e) => {
                formik.setFieldValue("citation", e.target.value);
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
          </>
        )}
        {activeStep === 2 && (
          <Box component="div">
            <Box
              component="div"
              style={{
                display: "inline-block",
                lineHeight: 1.5,
              }}
            >
              Click on{" "}
              <DetachedIcon
                style={{
                  height: "18px",
                  position: "relative",
                  top: "3px",
                }}
                className="remove-motion"
                onClick={(e) => { }}
              />{" "}
              to select the places and events you want to associate this library
              item to.
            </Box>
            {
              isAssociationStepInvalid &&
              <FormError
                style={{
                  marginTop: '1em'
                }}
                msg={ASSOCIATIONS_MANDATORY_ERR_MESSAGE}
              />
            }
            <AddedPlaces list={associatedPlaces} />
            <AddedEvents list={associatedEvents} />
          </Box>
        )}
        {activeStep === 3 && (
          <>
            <StepperKeywordsComponent
              onKeyDown={(keywordString) => {
                formik.setFieldValue("keywords", [
                  ...new Set([keywordString, ...formik.values.keywords]),
                ]);
              }}
              onDelete={(value) => {
                const newArr = [...formik.values.keywords].filter(
                  (element: string) => element !== value
                );
                formik.setFieldValue("keywords", [...new Set(newArr)]);
              }}
              currentKeywordArray={formik.values.keywords}
              setCurrentKeywordsArray={(arr: string[]) =>
                formik.setFieldValue("keywords", [...new Set(arr)])
              }
            />
          </>
        )}
      </Box>
    </>
  );
};

export default StepContent;
