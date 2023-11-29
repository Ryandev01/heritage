import { Box, Grid } from '@mui/material';
import styles from '../../NoDataScreens/index.module.css';

const NoTextPresent = ({
    message
}: { message: string }) => {
    return (
        <Box component="div" className={`${styles['wrapper']} ${styles['plain-text-wrapper']}`}>
            <Box component="div" className={`${styles['plain-text-div']}}`}>
                {message}
            </Box>
        </Box>
    );
}

export default NoTextPresent;