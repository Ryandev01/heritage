import { Box, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import styles from '../../NoDataScreens/index.module.css';

const NoMapPresent = ({
    message,
    style,
    className
}: { message: string, style?: React.CSSProperties, className?: string }) => {

    return <Box component="div" className={`${styles['wrapper']} ${styles['no-map-wrapper']} ${className ? styles[className] : ''}`} style={{ ...style }}>
        <Grid container className={`${styles['content-grid']}`} style={{
            flexDirection: 'column'
        }}>
            <Grid item style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <LocationOnIcon className={`${styles['content-image']}`} />
            </Grid>
            <Grid item className={`${styles['content-text']}`}>
                {message}
            </Grid>
        </Grid>
    </Box>
}

export default NoMapPresent;