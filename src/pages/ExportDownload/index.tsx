import { useEffect } from "react";
import Grid from '@mui/material/Grid';
import ExportCard from "../../components/ExportCard";
import Header from "../../components/Header";
import styles from "./index.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useDownload from "../../hooks/useDownload";

const ExportDownload = () => {
  // const { downloads } = useSelector(
  //   (state: RootState) => state.download
  // );
  const { fetchDownload:fetchDownload ,loading: downloadLoading, error: downloadErrorData, data: downloadData } = useDownload();
  useEffect(() => {
    fetchDownload();
  }, []);
  
  return (
    <>
      <div> 
        <Header/>
        <Grid 
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center" 
          component="div" className={`${styles["content-section"]}`}
          >
            {/* <Grid item component="div" className={`${styles["section-heading"]}`}>
                your data exports
            </Grid> */}
            <Grid
              item
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              component="div" className={`${styles["section-heading"]}`}
            >
              your data exports
            </Grid>
            <Grid
              item
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              {
                downloadData?.downloads?.data?.length>0?downloadData?.downloads?.data.map((item:any,index:any)=>{
                  return <ExportCard key={index} title={item.attributes.title} filePath={item.attributes.filePath} dataCount={item.attributes.dataCount} fileCount={item.attributes.fileCount} libraryCount={item.attributes.libraryCount} visitCount={item.attributes.visitCount} createdAt={item.attributes.createdAt} token={item.attributes.token} status={item.attributes.status} />
                }):<></>
              }
            </Grid>
            {/* <Grid container component="div" className={`${styles["section-card"]}`}>
                <ExportCard/>
            </Grid> */}
        </Grid>
      </div>
    </>
  );
};

export default ExportDownload;
