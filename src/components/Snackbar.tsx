import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Button from '@mui/material/Button';
import { IconButton } from "@mui/material";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionDown(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

type SnackbarProps = {
  message: string | React.ReactNode;
  severity?: "error" | "info" | "warning" | "success";
  open: boolean;
  handleClose: () => void;
  duration?: number
};

export default function PositionedSnackbar(props: SnackbarProps) {
  const { message, severity, open, handleClose, duration = 6000 } = props;
  
  const action:React.ReactNode = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        {/* <CloseIcon fontSize="small" /> */}
      </IconButton>
    </React.Fragment>
  );


  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top",
        horizontal: "center" }}
        TransitionComponent={TransitionDown}
        open={open}
        onClose={handleClose}
        key={"top center"}
        action={action}
        autoHideDuration={duration}
      >
        <Alert
          icon={false}
          onClose={handleClose}
          severity={severity ? severity : "success"}
          style={{
            backgroundColor: severity === "success" ? 'var(--snackbar-green)' : ''
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
