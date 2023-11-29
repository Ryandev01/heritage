import styles from "./index.module.css";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import IconButton from "@mui/material/IconButton";
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import { formatDateTimeZone } from '../../utils/services/helpers';

import {
    Button
} from "@mui/material";
import { Download } from "../../types/download";
import useDownloader from 'react-use-downloader';
import axios from "axios";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f9f7f2',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  maxWidth: 751,
}));

const ExportCard = ({ title, filePath, dataCount, fileCount, libraryCount, visitCount, createdAt, token , status }: Download) => {
const { size, elapsed, percentage, download, cancel, error, isInProgress } = useDownloader();
const handleClick = async (filePath:string) =>{
    //await download(`${process.env.REACT_APP_STRAPI_BASE_URL+''+filePath}`, `data_${Date.now()}.zip`);

    axios({
        url: `${process.env.REACT_APP_STRAPI_BASE_URL+''+filePath}`,
        method: "GET",

        responseType: "blob" // important

    }).then(response => {

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");

        link.href = url;

        link.setAttribute(

            "download",

            `data_${Date.now()}.zip`

        );

        document.body.appendChild(link);

        link.click();

    });

}
  return (
    <>
        <StyledPaper
            sx={{
            my: 1,
            mx: 'auto',
            p: 2,
            }}
            className={`${styles["content-box"]}`}
        >
            <Grid container wrap="nowrap" spacing={2}>
                <Grid item xs={12} sm={6} md={6} component="div" className={`${styles["grid-one"]}`}>
                    <Grid item xs={12} component="div" className={`${styles["box-heading"]}`}>
                            {title} - Data and Files
                    </Grid>
                    <Grid item xs={12} component="div" className={`${styles["box-span"]}`}>
                            {dataCount} {title==='Media'?"items":<>{title}</>} | {fileCount} {title!=='Media'?"Media":"files"} {title!=='Media'?title==='Library'?<></>:<>| {libraryCount} Library</>:<></>}
                    </Grid>
                    <Grid item xs={12} component="div" className={`${styles["box-span"]}`}>
                            {formatDateTimeZone(createdAt.toString())}
                    </Grid>
                </Grid>

                {/* <Grid item xs={12} sm={6} md={6} component="div"className={`${styles["grid-two"]}`}>
                    <Grid xs={12} component="div" className={`${styles["box-heading"]}`}>
                            Your download is being created
                    </Grid>
                    <Grid xs={12} component="div" className={`${styles["box-span"]}`}>
                            This may take a while. You can come back later.
                    </Grid>
                </Grid> */}
                {status==='Completed'?<Grid item xs={12} sm={6} md={6} component="div"className={`${styles["grid-two"]}`}>
                    <Grid item xs={12} display="flex" justifyContent="flex-end" >
                        <Button
                            variant="text"
                            onClick= {()=>{handleClick(filePath)}}                        
                            style={{
                                color:"white",
                                backgroundColor: "black",
                                border: "1px solid var(--light-grey-border)",
                                borderRadius: "40px",
                                padding: "0.2em 15px",
                                lineHeight: "1",
                                height: "100%",
                                textAlign: "center",
                            }}
                        >
                            <IconButton>
                                <GetAppOutlinedIcon 
                                    style={{
                                        color:"white",
                                    }
                                }/>
                            </IconButton>
                            DOWNLOAD
                        </Button>                        
                    </Grid>
                </Grid>:<Grid item xs={12} sm={6} md={6} component="div"className={`${styles["grid-two"]}`}>
                    <Grid item xs={12} display="flex" justifyContent="flex-end" >
                        <div 
                            style={{                                
                                color:"#FFCC00",
                                padding: "1em 10px",
                                lineHeight: "2",
                                height: "100%",
                                textAlign: "center",
                                fontSize: "1rem",
                            }}>
                                PENDING
                        </div>
                    </Grid>
                </Grid>}
            </Grid>
            
        </StyledPaper>
        
        
    </>
  );
};

export default ExportCard;
