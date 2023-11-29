import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Box, Grid } from '@mui/material';
import styles from '../../NoDataScreens/index.module.css';

const NoVideoPresent = ({
    message,
    style
}: { message: string, style?: React.CSSProperties }) => {
    return (
        <Box component="div" className={`${styles['wrapper']} ${styles['no-video-wrapper']}`} style={{ ...style }}>
            <Grid container className={`${styles['content-grid']}`} style={{
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}>
                <Grid item style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <VideocamOffIcon className={`${styles['content-image']} ${styles['map-image']}`} />
                </Grid>
                <Grid item className={`${styles['content-text']}`}>
                    {message}
                </Grid>
            </Grid>
        </Box>
    );
}

export default NoVideoPresent;