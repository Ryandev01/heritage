import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import styles from "../index.module.css";
import Button from "../../../components/Button";
import DetailsView from "../../../assets/images/searchResults/DetailsView.svg";
import ListViewIcon from "../../../assets/images/searchResults/ListView.svg";
import GridView from "./GridView/GridView";
import ListView from "./ListView/ListView";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useToggledView } from "./../../../hooks/useToggledView";
import usePlace from "../../../hooks/usePlace";
import { Meta } from "../../../types/Place";
import MapView from "../GoogleMap/MapView";
import { useEffect, useRef, useState } from "react";
import ExportModal from "../../ExportModal";
import { importContentType } from "../../../utils/export-import/import-content-type";
import { importCsvImagesZip } from "../../../utils/export-import/import-csv-images-zip";
import {checkSearchParameter, itemAddEditAccess, PLACES_TAB_NAME} from '../../../utils/services/helpers';
import { useDispatch } from "react-redux";
import { setToggledStates, setIsSelect } from "../../../store/reducers/searchResultsReducer";
import { Relation } from "../../../types/RelationType";

const PlacesTab = () => {
  const { searchText, places, placeMetaData, totalCounts, searchApply, toggledStates, isSelect } = useSelector(
    (state: RootState) => state.searchResults
  );
  const {selectedValue} = useSelector((state: RootState) => state.refinedSearch);

  const importFileInputRef: any = useRef(null);
  const importZipFileInputRef: any = useRef(null);

  const { fetchPlaces, hasMoreData, loading, mapPlaces, setEdit, searchData } =
    usePlace();

  const [isFilter, setIsFilter] = useState(null);
  const { openStates, toggleOpenStates } = useToggledView({ count: 2 });
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const meta: Meta | null = placeMetaData;
  const dispatch = useDispatch()

  /** Check if history list/grid view flag is present ,
  * if yes - set it
  */
  useEffect(() => {
    dispatch(setIsSelect(false));
    if (toggledStates.states && (toggledStates.tabName === PLACES_TAB_NAME)) {
      toggleOpenStates(toggledStates.states)
    }

  }, [])

  /* Event handlers */
  const exportPlace = async () => {
    let filter: any;
    if (searchData?.search) {
      filter = {
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

  const importPlace = (event: any) => {
    if (event?.target?.files?.length > 0) {
      const file = event?.target?.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (fileExtension === "json" || fileExtension === "csv" || fileExtension === "xlsx") {
       
        importContentType(
          file,
          "api::place.place",
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
            /* "id", */
           /*  "visit_associates",
            "remark_headers",
            "media_associates",
            "createdAt",
            "updatedAt", */
          ]
        );
      }
    }
  };

  const importZipPlace = (event: any) => {
    if (event?.target?.files?.length > 0) {
      const file = event?.target?.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
      importCsvImagesZip(
        file,
        "api::place.place",
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
          "visit_associates",
          "remark_headers",
          "media_associates",
          "createdAt",
          "updatedAt",
        ]
      );
    }
  };

  const fetchData = () => {
    fetchPlaces()
  }

  const showResults = checkSearchParameter(searchText, selectedValue) && searchApply;
  return (
    <Box component="div" className={`${styles["main-tab-content"]}`}>
      <Box component="div" className={`${styles["utility-bar"]}`}>
        <Box component="div">{showResults && meta?.pagination?.total ? `${meta?.pagination?.total} Results | ` : null}{totalCounts?.places} Total Places</Box>
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
          <input
            type="file"
            hidden
            ref={importZipFileInputRef}
            onChange={importZipPlace}
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
            onChange={importPlace}
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
            onClick={exportPlace}
          />
        </Box>
        <Box
          className={`${styles["view-toggler-icon"]}`}
          component="img"
          alt={""}
          src={DetailsView}
          onClick={(e) => {
            toggleOpenStates([true, false])
            dispatch(setToggledStates({
              states: [true, false],
              tabName: PLACES_TAB_NAME
            }))
          }}
          style={{
            opacity: openStates[0] ? "1" : "0.5",
          }}
        />
        <Box
          className={`${styles["view-toggler-icon"]}`}
          component="img"
          alt={""}
          src={ListViewIcon}
          onClick={(e) => {
            toggleOpenStates([false, true])
            dispatch(setToggledStates({
              states: [false, true],
              tabName: PLACES_TAB_NAME
            }))
          }}
          style={{
            opacity: openStates[1] ? "1" : "0.5",
          }}
        />
      </Box>
      <Box component={"section"} className={`${styles["result-section"]}`}>
        <Grid container spacing={1}>
          {openStates[0] && (
            <>
              <Grid item xl={6} lg={6} md={5} sm={5}>
                <GridView
                  setEdit={setEdit}
                  key={1}
                  totalData={meta?.pagination?.total}
                  loading={loading}
                  data={
                    isFilter === null
                      ? places
                      : places.filter((item) => {
                          return item.id === isFilter;
                        })
                  }
                  fetchData={fetchData}
                  hasMoreData={hasMoreData}
                  isSelect = {isSelect}
                />
              </Grid>
              {/* To-do: map view */}
              <Grid
                item
                xl={6}
                lg={6}
                md={7}
                sm={7}
                className={`${styles["map-section"]}`}
              >
                {mapPlaces !== null ? (
                  <MapView key={2} filterId={setIsFilter} marker={mapPlaces} />
                ) : (
                  <></>
                )}
              </Grid>
            </>
          )}
          {openStates[1] && (
            <Box
              component={"div"}
              style={{
                width: "100%",
              }}
            >
              <ListView
                setEdit={setEdit}
                key={3}
                loading={loading}
                data={
                  isFilter === null
                    ? places
                    : places.filter((item) => {
                        return item.id === isFilter;
                      })
                }
                fetchData={fetchData}
                hasMoreData={hasMoreData}
                isSelect = {isSelect}
              />
            </Box>
          )}
        </Grid>
      </Box>
      <ExportModal
        open={open}
        setOpen={setOpen}
        count={meta?.pagination?.total}
        path={"places"}
        filter={filter}
      />
    </Box>
  );
};

export default PlacesTab;

