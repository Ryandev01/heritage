import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import styles from '../index.module.css'
import Button from "../../../components/Button";
import ListViewIcon from '../../../assets/images/searchResults/ListView.svg'
import GridViewIcon from '../../../assets/images/searchResults/GridView.svg'

import GridView from './GridView/GridView';
import ListView from './ListView/ListView';
import { Grid } from '@mui/material';
import MapImg1 from '../../../assets/images/searchResults/mapImage1.webp'
import MapImg2 from '../../../assets/images/searchResults/mapImage2.jpg'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useToggledView } from './../../../hooks/useToggledView';
import useMedia from '../../../hooks/useMedia';
import { Meta } from '../../../types/Place';
import {checkSearchParameter, itemAddEditAccess, MEDIA_TAB_NAME} from '../../../utils/services/helpers';
import ExportModal from '../../ExportModal';
import { importContentType } from '../../../utils/export-import/import-content-type';
import { importCsvImagesZip } from '../../../utils/export-import/import-csv-images-zip';
import Loader from '../../Common/Loader';
import { useDispatch } from 'react-redux';
import { setToggledStates,setIsSelect } from '../../../store/reducers/searchResultsReducer';


const MediaTab = () => {
    const { selectedCardIndex, media, mediaMetaData, totalCounts, searchText, searchApply,
      toggledStates, isSelect } = useSelector(
        (state: RootState) => state.searchResults
    );
    const {selectedValue} = useSelector((state: RootState) => state.refinedSearch);
    const [img, setimg] = useState(MapImg1);
    const importFileInputRef:any = useRef(null); 
    const importZipFileInputRef:any = useRef(null); 

    const { fetchMediaItems, hasMoreData, loading, setEdit,searchData } = useMedia();
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(null);

    const meta: Meta | null = mediaMetaData;
    useEffect(() => {
        setimg(selectedCardIndex % 2 === 0 ? MapImg2 : MapImg1)
    }, [selectedCardIndex])

  const { openStates, toggleOpenStates } = useToggledView({ count: 2 })

  const dispatch = useDispatch()

  /** Check if history list/grid view flag is present
  * if yes - set it
  */
  useEffect(() => {
    dispatch(setIsSelect(false))
    if (toggledStates.states && (toggledStates.tabName === MEDIA_TAB_NAME)) {
      toggleOpenStates(toggledStates.states)
    }

  }, [])

    if(!media && !loading) {
      return <>Cant fetch media</>
    }
    if(loading) {
      return <><Loader/></>
    }

    /* event handlers */
  const exportMedia = async () => {
        let filter: any={ media_type :{
            categoryCode: {
              $containsi: "MEDIA"
          }
        }};
    if (searchData?.search) {
      filter = {...filter,
        $or: [
          {
            title: {
              $containsi: searchData.search,
            },
          },
          {
            description: {
              $containsi: searchData.search,
            },
          },
          {
            fileName: {
              $containsi: searchData.search,
            },
          },
          {
            citation: {
              $containsi: searchData.search,
            },
          },
          ,
        ],
        $and:[
          {
            deleted:{$eq:false}
          }
        ]
      };
    }
    else{
      filter = {
        $and:[
          {
            deleted:{$eq:false}
          }
        ]
    };
  }
    setFilter(filter);
    setOpen(true);
  };

  const chooseImportFile = () => {
    importFileInputRef?.current?.click();
  };

  const chooseZipFile = () => {
    importZipFileInputRef?.current?.click();
  };

  const importMedia = (event: any) => {
    if (event?.target?.files?.length > 0) {
      const file = event?.target?.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (fileExtension === "json" || fileExtension === "csv") {
        importContentType(file, "api::media.media");
      }
    }
  };

  const importZipMedia = (event: any) => {
    if (event?.target?.files?.length > 0) {
      const file = event?.target?.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
      importCsvImagesZip(file, "api::media.media",["categoryType","keywords"],[
        "id",
        "object",
        "media_associate",
        "imageMetadata:fileName",
        "imageMetadata:longitude",
        "imageMetadata:latitude",
        "imageMetadata:Created",
        "imageMetadata:Modified",
        "imageMetadata:Depth",
        "imageMetadata:Dimension",
        "imageMetadata:File Size",
        "imageMetadata:Make",
        "imageMetadata:Model",
        "imageMetadata:Storage",
        "createdAt",
        "updatedAt",
      ],[],true);

    }
  };

  const showResults = checkSearchParameter(searchText, selectedValue) && searchApply;
    return (
        <Box component="div" className={`${styles['main-tab-content']}`}>
            <Box component="div" className={`${styles['utility-bar']}`}>
                <Box component="div">{ showResults && meta?.pagination?.total ? `${meta?.pagination?.total} Results | ` : null}{totalCounts?.media} Total Media Items</Box>
                <Box component="div" style={{ display: "flex" }}>
                {itemAddEditAccess && <Button
            colors={[
              "transparent",
              "var(--table-black-text)",
              "var(--table-black-text)",
            ]}
            className={`${styles["export-btn"]}`}
            label="Import zip"
            style={{
              border: "1px solid var(--light-grey-border)",
              borderRadius: "40px",
              padding: "0.2em 15px",
              lineHeight: "2",
              height: "100%",
              textAlign: "center",
            }}
            onClick={chooseZipFile}
          />}
          <input type="file" hidden ref={importZipFileInputRef} onChange={importZipMedia}/>
          {itemAddEditAccess && <Button
            colors={[
              "transparent",
              "var(--table-black-text)",
              "var(--table-black-text)",
            ]}
            className={`${styles["export-btn"]}`}
            label="Import data only"
            style={{
              border: "1px solid var(--light-grey-border)",
              borderRadius: "40px",
              padding: "0.2em 15px",
              lineHeight: "2",
              height: "100%",
              textAlign: "center",
            }}
            onClick={chooseImportFile}
          />}
          <input type="file" hidden ref={importFileInputRef} onChange={importMedia}/>
          <Button
            colors={[
              "transparent",
              "var(--table-black-text)",
              "var(--table-black-text)",
            ]}
            className={`${styles["export-btn"]}`}
            label={isSelect?"Cancel":"Select"}
            style={{
              border: "1px solid var(--light-grey-border)",
              borderRadius: "40px",
              padding: "0.2em 15px",
              lineHeight: "2",
              height: "100%",
              textAlign: "center",
            }}
            onClick={()=>{dispatch(setIsSelect(!isSelect))}}
          />
          <Button
            colors={[
              "transparent",
              "var(--table-black-text)",
              "var(--table-black-text)",
            ]}
            className={`${styles["export-btn"]}`}
            label="Export"
            style={{
              border: "1px solid var(--light-grey-border)",
              borderRadius: "40px",
              padding: "0.2em 15px",
              lineHeight: "2",
              height: "100%",
              textAlign: "center",
            }}
            onClick={exportMedia}
          />
        </Box>
                {/* <Box component="div" className={`${styles['view-toggler-icon']}`} component="img" alt={""} src={DetailsView}
                    onClick={e => toggleOpenStates([false, true, false])}
                    style={{
                        opacity: openStates[1] ? '1' : '0.5'
                    }}
                /> */}
                <Box className={`${styles['view-toggler-icon']}`} component="img" alt={""} src={GridViewIcon}
                    onClick={e => {
                      toggleOpenStates([true, false])
                      dispatch(setToggledStates({
                        states: [true, false],
                        tabName: MEDIA_TAB_NAME
                      }))
                    }}
                    style={{
                        opacity: openStates[0] ? '1' : '0.5'
                    }}

                />
                <Box className={`${styles['view-toggler-icon']}`} component="img" alt={""} src={ListViewIcon}
                    onClick={e => {
                      toggleOpenStates([false, true])
                      dispatch(setToggledStates({
                        states: [false, true],
                        tabName: MEDIA_TAB_NAME
                      }))
                    }}
                    style={{
                        opacity: openStates[1] ? '1' : '0.5'
                    }}
                />
            </Box>
            <Box component={'section'} className={`${styles['result-section']}`}>
                <Grid container spacing={1}>
                    {/* {openStates[0] &&<Grid item xl={6} lg={6} md={5} sm={5}>
                        <GridView />
                    </Grid>} */}
                    {openStates[0] && <Grid item xl={12}>
                        <GridView totalData={meta?.pagination?.total} loading={loading} data={media} fetchData={fetchMediaItems} hasMoreData={hasMoreData} setEdit={setEdit} isSelect = {isSelect}/>
                    </Grid>}
                    {/* To-do: map view */}
                    {/* <Grid item xl={6} lg={6} md={7} sm={7}>
                        <Box component="div" className={`${placesStyles['map-img']}`} component="img" alt={""} src={img} />
                    </Grid> */}
                    {
                        openStates[1] &&
                        <Box component={'div'} style={{
                            width: '100%'
                        }}>
                            <ListView loading={loading} data={media} fetchData={fetchMediaItems} hasMoreData={hasMoreData} setEdit={setEdit} isSelect = {isSelect}/>
                        </Box>
                    }
                </Grid>
            </Box>
            <ExportModal open={open} setOpen={setOpen} count={meta?.pagination?.total} path={'medias'} filter={filter}/>
        </Box>
    );
}

export default MediaTab;