import styles from "./index.module.css";
import Box from '@mui/material/Box';
import { getSupportEmail } from "../../utils/storage/storage";

export const LinkExpired = () => {
  return <Box component="div" className={`${styles["expired-link-content"]}`}>
    <Box component="div">
      LINK EXPIRED
    </Box>
    <Box component="div">
    Please contact{' '}
      <a
        href={`mailto: ${getSupportEmail() || ''}?subject = xyz`}
        target={"_blank"}
        rel="noreferrer"
      >
        {getSupportEmail() || ''}
      </a>
    </Box>
  </Box>
}
