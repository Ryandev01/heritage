import { ChangeEvent, useState } from "react";
import { Grid, Box } from "@mui/material";
import {
  CommentSectionProps,
  SingleCommentProps,
} from "../../types/SearchResultsTabsProps";
import {
  commonFormControlSxStyles,
  formatWebDate,
  textInputSxStyles,
  remarksDeleteAccess,
  remarkAddEditAccess,
} from "../../utils/services/helpers";
import TextInput from "../../components/TextInput";
import styles from "./index.module.css";
import { CustomMoreOptionsComponent } from "../CustomMoreOptionsComponent";
import { Remark } from "../../types/Remarks";
import SendIcon from "@mui/icons-material/Send";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { getId } from "../../utils/storage/storage";
import RenderInitials from "../RenderInitials";

const SingleComment = ({
  SelfIcon,
  addRemarks,
  openReply,
  handleAction,
  remark,
  showInput,
  childInputs,
  setChildInput,
  type,
}: SingleCommentProps) => {

  const editAction = [
    {
      label: "Edit",
      action: () => {
        handleAction('edit', remark, type);
      },
    },
    {
      label: "Delete",
      action: () => {
        handleAction('delete', remark, type);
      },
    },
  ];

  const deleteAction = [
    {
      label: "Delete",
      action: () => {
        handleAction('delete', remark, type);
      },
    }
  ]

  const checkMine = () => {
    if (type === "child") {
      return getId() == remark?.users_permissions_user?.id;
    } else {
      return getId() == remark?.remark_details?.users_permissions_user?.id;
    }
  };
  if (type !== "child" && remark && !remark?.remark_details?.id) {
    return null
  }
  return (
    <>
      <Box component="div">
        <Grid
          container
          style={{
            justifyContent: "start",
            alignItems: "start",
            gap: "0.5em",
            marginBottom: "1em",
            marginLeft: `calc(${type === "child" ? 1 : 0}* 10%)`, // TODO: add nesting level hardcode
          }}
        >
          <Grid item sm={1}>
          <RenderInitials firstName={type === "child"
                  ? `${remark?.users_permissions_user?.firstName}` : `${remark.remark_details?.users_permissions_user?.firstName}`} 
                  lastName={type === "child"
                  ? `${remark?.users_permissions_user?.lastName}` : `${remark.remark_details?.users_permissions_user?.lastName}`} />
          </Grid>
          <Grid item sm={8}>
            <Box
              component="div"
              style={{
                display: "inline-block",
                lineHeight: "1.2",
              }}
            >
              <Box
                component="div"
                style={{
                  fontWeight: "bold",
                  float: "left",
                  marginRight: "0.5em",
                }}
                display={"block"}
              >
                {type === "child"
                  ? `${remark?.users_permissions_user?.firstName} ${remark?.users_permissions_user?.lastName}`
                  : `${remark.remark_details?.users_permissions_user?.firstName} ${remark.remark_details?.users_permissions_user?.lastName}`}
              </Box>
            </Box>
            <Box component="div">
              {type === "child"
                ? remark?.description
                : remark?.remark_details.description}
            </Box>
            <Grid
              container
              style={{
                color: "var(--medium-gray)",
                alignItems: "center",
              }}
            >
              <Grid
                item
                style={{
                  marginRight: "1em",
                }}
              >
                {type === "child"
                  ? formatWebDate(remark?.updatedAt)
                  : formatWebDate(remark?.remark_details.updatedAt)}
              </Grid>
              {(type === "child" && !remarkAddEditAccess) ? null : (
                <Grid
                  item
                  style={{
                    marginRight: "2em",
                    cursor: "pointer",
                  }}
                  onClick={() => openReply && openReply(remark.id === showInput ? null : remark.id)}
                >
                  Reply
                </Grid>
              )}
              {checkMine() ? <Grid item>
                <CustomMoreOptionsComponent menuActions={editAction} />
              </Grid> : <>{remarksDeleteAccess ? <CustomMoreOptionsComponent menuActions={deleteAction} />: null}</>}
            </Grid>

            {remark.id === showInput ? (
              <Grid item display={"flex"}>
                <TextInput
                  className={``}
                  label="Comment"
                  name="Comments"
                  value={childInputs}
                  onChange={(e) => {
                    if (setChildInput) {
                      setChildInput(e.target.value);
                    }
                    e.preventDefault();
                  }}
                  onKeyDown={(e) => {e.code === "Enter" && e.preventDefault()}}
                  sx={{
                    ...textInputSxStyles,
                    "& .MuiFormControl-root.MuiTextField": {
                      height: "fit-content",
                    },
                  }}
                  formControlSx={commonFormControlSxStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={(e) =>
                            addRemarks(remark?.remark_details.remark_header_id)
                          }
                        >
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        {remark.remark_details?.child?.length > 0 ? (
          <>
            {remark.remark_details.child?.map((remark: any, index: number) => (
              <div key={index}>
                <SingleComment
                  remark={remark}
                  addRemarks={addRemarks}
                  SelfIcon={SelfIcon}
                  type="child"
                  handleAction={handleAction}
                />
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

const CommentsSection = ({
  id,
  type,
  SelfIcon,
  remarks,
  addRemarks,
  updateRemarks
}: CommentSectionProps) => {
  const [inputs, setInputs] = useState("");
  const [childInputs, setChildInput] = useState<string>("");
  const [showInput, setShowInput] = useState<number | null>(null);
  const [actionData, setActionData] = useState<any | null>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      e.preventDefault();
      // handleRemarks()
    }
  }

  const openReply = (id: number) => {
    setShowInput(id);
  };

  const addChildRemarks = (remark_id: number) => {
    if (actionData?.type === "edit") {
      
      updateRemarks({
        id: (actionData?.childType === "child" ? actionData.data.id : actionData.data.remark_details.id),
        data: {description: actionData?.childType === "child" ? childInputs : inputs, delete: false}
      });
      setActionData(null);
    } else if (remark_id) {
      addRemarks({
        id,
        type: type,
        description: childInputs,
        remark_header_id: remark_id,
      });
    }
    setShowInput(null);
    setChildInput("");
  };

  const handleAction = (actionType: "edit" | "delete" | "support", remark: any, childType?: "child") => {
    setActionData({data: remark, type: actionType, childType: childType});
    switch (actionType) {
      case "edit":
        if (childType === "child") {
          openReply(remark.remark_header_id);
          setChildInput(remark.description)
        }else {
          setInputs(remark.remark_details.description)
        }
        break;
      case "delete":
        updateRemarks({
          id: (childType === "child" ? remark.id : remark.remark_details.id),
          data: {delete: true}
        })
        break;
    
      default:
        break;
    }
  }

  const handleRemarks = () => {
    if (actionData?.type === "edit") {
      
      updateRemarks({
        id: (actionData?.childType === "child" ? actionData.data.id : actionData.data.remark_details.id),
        data: {description: actionData?.childType === "child" ? childInputs : inputs, delete: false}
      });
      
      setActionData(null);
    } else  {
      addRemarks({
        id,
        type: type,
        description: inputs,
      });
    }
    setInputs("");
  }

  return (
    <Box component="div" className={`${styles["comments-container"]}`}>
       {remarkAddEditAccess && <Grid
        container
        style={{
          justifyContent: "start",
          alignItems: "center",
          gap: "1em",
          marginBottom: "2em",
        }}
      >
        <Grid item>
          <SelfIcon />
        </Grid>
       <Grid item>
          <TextInput
            className={``}
            label="Remarks"
            name="remarks"
            value={inputs}
            onChange={(e) => {
              setInputs(e.target.value);
              e.preventDefault();
            }}
            sx={{
              ...textInputSxStyles,
              "& .MuiFormControl-root.MuiTextField": {
                height: "fit-content",
              },
            }}
            onKeyDown={onKeyDown}
            formControlSx={commonFormControlSxStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={(e) => {
                      e.preventDefault();
                     handleRemarks()
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>}
      <Box component="div" className={`${styles["comments-list-parent-box"]}`}>
        {remarks &&
          remarks.map((remark: Remark, index: number) => (
            <div key={index}>
              <SingleComment
                remark={remark}
                addRemarks={addChildRemarks}
                SelfIcon={SelfIcon}
                setChildInput={setChildInput}
                childInputs={childInputs}
                showInput={showInput}
                openReply={openReply}
                handleAction={handleAction}
                // commentObj={singleCommentItem}
              />
            </div>
          ))}
      </Box>
    </Box>
  );
};

export default CommentsSection;
