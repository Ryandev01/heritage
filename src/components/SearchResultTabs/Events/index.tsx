import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import styles from '../index.module.css'
import Button from "../../../components/Button";
import DetailsView from '../../../assets/images/searchResults/DetailsView.svg'
import ListViewIcon from '../../../assets/images/searchResults/ListView.svg'
import GridView from './GridView/GridView';
import ListView from './ListView/ListView';
import { Grid } from '@mui/material';
import MapImg1 from '../../../assets/images/searchResults/mapImage1.webp'
import MapImg2 from '../../../assets/images/searchResults/mapImage2.jpg'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useToggledView } from './../../../hooks/useToggledView';
import useEvent from '../../../hooks/useEvent';
import { Meta } from '../../../types/Place';
import MapView from '../GoogleMap/MapView';
import ExportModal from '../../ExportModal';
import { importContentType } from '../../../utils/export-import/import-content-type';
import { importCsvImagesZip } from '../../../utils/export-import/import-csv-images-zip';
import {checkSearchParameter, EVENTS_TAB_NAME, itemAddEditAccess} from '../../../utils/services/helpers';
import { setToggledStates,setIsSelect } from '../../../store/reducers/searchResultsReducer';
import { useDispatch } from 'react-redux';
import { Relation } from "../../../types/RelationType";

const PlacesTab = () => {
  const { selectedCardIndex, events, totalCounts, eventMetaData, searchText, searchApply,
    toggledStates, isSelect } = useSelector(
    (state: RootState) => state.searchResults
  );
  const importFileInputRef: any = useRef(null);
  const importZipFileInputRef: any = useRef(null);
  const {selectedValue} = useSelector((state: RootState) => state.refinedSearch);
  const [img, setimg] = useState(MapImg1);
  const [isFilter, setIsFilter] = useState(null);
  const { fetchEvents, hasMoreData, loading, mapEvents, setEdit, searchData } = useEvent();
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState(null);

  useEffect(() => {
    setimg(selectedCardIndex % 2 === 0 ? MapImg2 : MapImg1)
    dispatch(setIsSelect(false))
  }, [selectedCardIndex])

  const { openStates, toggleOpenStates } = useToggledView({ count: 2 })

  const meta: Meta | null = eventMetaData;

  const handleNext = () => {
    fetchEvents();
  }

  const dispatch = useDispatch()

  /** Check if history list/grid view flag is present
   * if yes - set it
   */
  useEffect(() => {
    if (toggledStates.states && (toggledStates.tabName === EVENTS_TAB_NAME)) {
      toggleOpenStates(toggledStates.states)
    }

  }, [toggledStates])

  /* Event handlers */
  const exportEvent = async () => {
    let filter: any;
    if (searchData?.search) {
      filter = {
        $or: [
          {
            siteDescription: {
              $containsi: searchData.search,
            },
          },
          {
            recordingTeam: {
              $containsi: searchData.search,
            },
          },
          {
            fieldNarrative: {
              $containsi: searchData.search,
            },
          }
        ],
        $and:[
          {
            deleted:{$eq:false}
          }
        ]
      };
    }else{
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

  const importEvent = (event: any) => {
    if (event?.target?.files?.length > 0) {
      const file = event?.target?.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (
        fileExtension === "json" ||
        fileExtension === "csv" ||
        fileExtension === "xlsx"
      ) {
        const relations: Relation[] = [
          {
            bindingContentType: "visit-associates",
            keyContentType:"visits",
            parentContentType:"places",
            key: "visit_unique_id",
            keyColumn: "uniqueId",
            parent: "place_unique_id",
            parentColumn: "Parent ID",
            extra: { deleted: false },
          },
        ];
        importContentType(
          file,
          "api::visit.visit",
          [
            "siteType",
            "researchValue",
            "artifacts",
            "tourismValue",
            "stateOfConservation",
            "recommendation",
            "risk",
            "period",
            "assessmentType",
            "keywords",
          ],
          [
            "id",
            "visit_associates",
            "remark_headers",
            "media_associates",
            "createdAt",
            "updatedAt",
          ],
          relations
        );
      }
    }
  };

  const importZipEvent = (event: any) => {
    if (event?.target?.files?.length > 0) {
      const file = event?.target?.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
      importCsvImagesZip(
        file,
        "api::visit.visit",
        [
          "siteType",
          "researchValue",
          "artifacts",
          "tourismValue",
          "stateOfConservation",
          "recommendation",
          "risk",
          "period",
          "keywords",
        ],
        [
          "id",
          "asset_config_id",
          "visit_associates",
          "remark_headers",
          "media_associates",
          "createdAt",
          "updatedAt",
        ]
      );
    }
  };

  const showResults = checkSearchParameter(searchText, selectedValue) && searchApply;
    return (
        <Box component="div" className={`${styles['main-tab-content']}`}>
            <Box component="div" className={`${styles['utility-bar']}`}>
                <Box component="div">{showResults && meta?.pagination?.total ? `${meta?.pagination?.total} Results | ` : null}{totalCounts?.events} Total Events</Box>
                <Box component="div" style={{display:"flex"}}>
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
          <input
            type="file"
            hidden
            ref={importZipFileInputRef}
            onChange={importZipEvent}
          />
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
          <input
            type="file"
            hidden
            ref={importFileInputRef}
            onChange={importEvent}
          />
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
            onClick={exportEvent}
          />
                </Box>
                <Box className={`${styles['view-toggler-icon']}`} component="img" alt={""} src={DetailsView}
                    onClick={e => {
                      toggleOpenStates([true, false])
                      dispatch(setToggledStates({
                        states: [true, false],
                        tabName: EVENTS_TAB_NAME
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
                        tabName: EVENTS_TAB_NAME
                      }))
                    }}
                    style={{
                        opacity: openStates[1] ? '1' : '0.5'
                    }}
                />
            </Box>
            <Box component={'section'} className={`${styles['result-section']}`}>
                <Grid container spacing={1} className={`${styles['result-section--grid']}`}>
                    {openStates[0] && <><Grid item xl={6} lg={6} md={5} sm={5}>
                        <GridView key={10} loading={loading} data={isFilter===null?events:events.filter((item)=>{return item.id===isFilter})} handleNext={handleNext} setEdit={setEdit} hasMoreData={hasMoreData} isSelect = {isSelect}/>
                    </Grid>
                    {/* To-do: map view */}
                    <Grid item xl={6} lg={6} md={7} sm={7} className={`${styles["map-section"]}`}>                     
                        {mapEvents !== null ? <MapView key={11} filterId={setIsFilter} marker={mapEvents}/>:<></>}
                    </Grid></>}
                    {
                        openStates[1] &&
                        <Box component={'div'} style={{
                            width: '100%'
                        }}>
                            <ListView setEdit={setEdit} key={12} loading={loading} data={isFilter===null?events:events.filter((item)=>{return item.id===isFilter})} handleNext={handleNext} hasMoreData={hasMoreData} isSelect = {isSelect}/>
                        </Box>
                    }
                </Grid>
                
            </Box>
            <ExportModal open={open} setOpen={setOpen} count={meta?.pagination?.total} path={'visits'} filter={filter}/>
        </Box>
    );
}
 
export default PlacesTab;