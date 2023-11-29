import { Box, Grid } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import styles from '../../NoDataScreens/index.module.css';

const NoImagePresent = ({
    message,
    style,
    className
}: { message: string, style?: React.CSSProperties, className?: string }) => {
    return (
        <Box component="div" className={`${styles['wrapper']} ${className ? styles[className] : ''}`} style={{ ...style }}>
            <Grid container className={`${styles['content-grid']}`} style={{
                flexDirection: 'column'
            }}>
                <Grid item style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <ImageOutlinedIcon className={`${styles['content-image']} ${styles['map-image']}`} />
                </Grid>
                <Grid item className={`${styles['content-text']}`}>
                    {message}
                </Grid>
            </Grid>
        </Box>
    );
}

export default NoImagePresent;