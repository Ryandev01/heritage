import React, { ChangeEvent, useEffect } from "react";
import styles from "./index.module.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { SelectChangeEvent } from "@mui/material/Select";

import Places from "../../assets/images/searchResults/Places.svg";
import Events from "../../assets/images/searchResults/Events.svg";
import Library from "../../assets/images/searchResults/Library.svg";
import Media from "../../assets/images/searchResults/Media.svg";
import {
  LabelProps,
  SearchResultTabsProps,
  tabNameProps,
  TabPanelProps,
} from "../../types/SearchResultsTabsProps";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PlacesTab from "./Places";
import EventsTab from "./Events";
import LibraryTab from "./Library";
import MediaTab from "./Media/index";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefinedSearchInputs from "../RefinedSearchInputs";
import { EVENTS_TAB_NAME, LIBRARY_TAB_NAME, MEDIA_TAB_NAME, PLACES_TAB_NAME, tabIndexBasedOnName } from "../../utils/services/helpers";
import { useDispatch } from "react-redux";
import {setSelectedValue, resetSorting} from '../../store/reducers/refinedSearchReducer';
import { MediaDetailsModal } from "./Media/MediaDetails";
import GalleryView from './GalleryView/index';
import { setActiveMediaItem, setActiveMediaItemIndex, setActivePlaceItem, setActivePlaceItemIndex, setHistoryRedux, setSearchApply, toggleGalleryView } from "../../store/reducers/searchResultsReducer";
import PlaceDetailsPage from "./Places/PlaceDetails";
import EventDetailsPage from "./Events/EventDetails";
import { LibraryDetailsModal } from "./Library/LibraryDetails";

function TabPanel(props: TabPanelProps) {
  const { children, value, index, className, ...other } = props;

  return (
    <div
      className={`${styles["tab-panel-component"]}`}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box component="div" sx={{ p: 3 }} className={className}>
          <Grid>{children}</Grid>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const TabLabels = [
  {
    img: Places,
    label: "Places",
  },
  {
    img: Events,
    label: "Events",
  },
  {
    img: Library,
    label: "Library",
  },
  {
    img: Media,
    label: "Media",
  },
];

const Label = ({ img, label }: LabelProps) => {
  return (
    <>
      <Box component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5em",
        }}
      >
        <Box component="img" alt={""} src={img} />
        <Box component="div"
          sx={{
            color: "initial",
          }}
        >
          {label}
        </Box>
      </Box>
    </>
  );
};

const initialState = {
  stateOfConservation: [],
  period: [],
  recommendation: [],
  researchValue: [],
  tourismValue: [],
  risk: [],
  assessmentType: [],
  artifacts: [],
  actionType: [],
  latitude: '',
  longitude: '',
  featuredImage: false,
  startDate: undefined,
  endDate: undefined,
  keyWords: [],
}
const SearchResultTabs = ({ tabIndex, handleSubmit }: SearchResultTabsProps) => {
  const [value, setValue] = React.useState(0);
  let { tabName, uniqueId } = useParams<{ tabName?: tabNameProps, uniqueId: string }>();
  const location = useLocation()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchText, openGalleryView, showAddSuccess, history } = useSelector((state: RootState) => state.searchResults);
  const { options, selectedValue } = useSelector((state: RootState) => state.refinedSearch);
  const { edit } = useSelector((state: RootState) => state.tabEdit);

  useEffect(() => {
    if (tabName) {
      const newTabIndex = tabIndexBasedOnName(tabName);
      setValue(newTabIndex);
      dispatch(setSelectedValue(initialState));
      dispatch(resetSorting(null));

      /** resetters */

      // 1 TO-DO
      // if(!uniqueId) {
      //   if(showAddSuccess) {
      //     dispatch(toggleShowAddSuccess(false));
      //   }
      //   if(showEditSuccess) {
      //     dispatch(toggleShowEditSuccess(false));
      //   }
      // }

      // 2
      if(!uniqueId) {

        /** means only tab switch has occured from accordion.
         * Add further parameter to this if as and when required
         */
        dispatch(toggleGalleryView({
          flag: false,
          galleryViewItemList: [],
          galleryViewIdList: []
        }));

      }

    }
  }, [tabName]);

  useEffect(() => {
    /** from whichever url edit flag is toggled, that flag should be the last flag in the history array */
    if (edit) {

      let newArr = [...history]

      const currentUrl = `${location.pathname}${location.search ? location.search : ''}`

      if(newArr.length === 0) {
        dispatch(setHistoryRedux([currentUrl]))
      } else if(newArr[newArr.length-1] !== currentUrl) {
        dispatch(setHistoryRedux([...history, currentUrl]))
      }
    }
  }, [edit])

  const handleTextChange =(e: SelectChangeEvent<string | string[]> | ChangeEvent<HTMLInputElement>, checked?: Boolean) => {
    e.preventDefault();
    const selectedValueCopy = JSON.parse(JSON.stringify(selectedValue));
    selectedValueCopy[e.target.name] = e.target.name === "featuredImage" ? checked : e.target.value;
    dispatch(setSelectedValue(selectedValueCopy));
  }
  
  const handleSelectChange =(e: React.SyntheticEvent, value: string[] | [], reason?: string) => {
    if (reason) {
      const selectedValueCopy = JSON.parse(JSON.stringify(selectedValue));
      selectedValueCopy[reason] = value;
      e.preventDefault();
      dispatch(setSelectedValue(selectedValueCopy));
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    let newLabel = TabLabels[newValue].label;
    event.preventDefault();

    /** resetters */
    dispatch(setActivePlaceItem(null))
    dispatch(setActivePlaceItemIndex(0))
    dispatch(setActiveMediaItem(null))
    dispatch(setActiveMediaItemIndex(0))

    navigate({
      pathname: `/${newLabel ? newLabel : "Places"}`,
      search: decodeURIComponent(JSON.stringify({
        search: searchText
      }))
    });
  };

  const handleButtonSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch(setSearchApply(true));
    const copiedValue = JSON.parse(JSON.stringify(selectedValue));
    Object.keys(copiedValue).map(x => {
      if (copiedValue[x].length === 0) {delete copiedValue[x];}
      return x;
    });
    if (tabName !== 'Events') {
      delete copiedValue.startDate;
      delete copiedValue.endDate;
    }
    if (tabName !== 'Media') {
      delete copiedValue.featuredImage;
    }
    const searchParams: string = decodeURIComponent(JSON.stringify({
      search: searchText,
      refinedSearch: {...copiedValue}
    }));
    if (handleSubmit) {
      handleSubmit();
    }
    navigate({
      pathname: `/${tabName}`,
      search: searchParams
    });
  };

  const handleClear = (e: any, name?: string) => {
    const selectedValueCopy = JSON.parse(JSON.stringify(selectedValue));
    
    if (name) {
      selectedValueCopy[name] = (
        name === 'location'
      ) ? '' : [];

      if(
        (name === 'latitude') || (name === 'longitude')
      ) {
        selectedValueCopy['latitude'] = ''
        selectedValueCopy['longitude'] = ''
      }

      e.preventDefault();
      dispatch(setSelectedValue(selectedValueCopy));
    }
  };

  const handleDate = (date:Date | null, name: string) => {
    const selectedValueCopy = JSON.parse(JSON.stringify(selectedValue));
    if (name && date) {

      selectedValueCopy[name] = date;
      dispatch(setSelectedValue(selectedValueCopy));
    }else if (name === "clearDate") {
      selectedValueCopy['startDate'] = undefined;
      selectedValueCopy['endDate'] = undefined;
      dispatch(setSelectedValue(selectedValueCopy));
    }
  }

  /** If get itedId, means its details page
   * Hence replace tabs view and open normal view
   */
  if(uniqueId) {
    if(tabName === PLACES_TAB_NAME) {

      if (openGalleryView.flag === "from-place-details-gallery") {
        return <div className={`${styles["search-results-wrapper"]}`}>
          <GalleryView />
        </div>
      }

      return <>
        <div className={`${styles["search-results-wrapper"]}`}>
          <PlaceDetailsPage />
        </div>
      </>
    }

    if(tabName === EVENTS_TAB_NAME) {

      return <>
        <div className={`${styles["search-results-wrapper"]}`}>
          <EventDetailsPage />
        </div>
      </>
    }

    if(tabName === LIBRARY_TAB_NAME) {
      return <>
        <div className={`${styles["search-results-wrapper"]}`}>
          <LibraryDetailsModal />
        </div>
      </>
    }
    
    if(tabName === MEDIA_TAB_NAME) {
      return <>
        <div className={`${styles["search-results-wrapper"]}`}>
          <MediaDetailsModal />
        </div>
      </>
    }
  }

  return (
    <div className={`${styles["search-results-wrapper"]}`}>
      <Box component="div" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          className={`${styles["tab-titles"]}`}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          indicatorColor="secondary"
          TabIndicatorProps={{
            sx: {
              backgroundColor: "var(--clr-gold)",
            },
          }}
          sx={{
            paddingInline: "var( --container-spacing)",
          }}
        >
          {TabLabels.map((labelObj, index) => (
            <Tab
              key={index}
              label={<Label img={labelObj.img} label={labelObj.label} />}
              {...a11yProps(index)}
              sx={{
                textTransform: "initial",
                padding: "0em 2em",
                minHeight: "35px",
              }}
              className={`${styles["tab"]}`}
            />
          ))}
        </Tabs>
      </Box>
      {value !== 2 && <Box component="div" className={`${styles["refined-search-box"]}`} sx={{
        '& .Mui-expanded.MuiPaper-root.MuiAccordion-root': {
          marginInline: 'auto',
        },
        '& .MuiPaper-root.MuiAccordion-root': {
          backgroundColor: 'transparent',
          boxShadow: 'none'
        },
        '& .MuiAccordionSummary-root': {
          marginInline: 'auto',
          width: 'fit-content'
        }
      }}>
        <Accordion className={`${styles["refined-search-wrapper"]}`} sx={{
          '& .MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded': {
            minHeight: 'fit-content'
          }
        }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{
              color: 'var(--grey-text)'
            }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div style={{
              letterSpacing: '0.1em',
              color: 'var(--grey-text)'
            }}>Refine Search</div>
          </AccordionSummary>
          <AccordionDetails style={{
            padding: 0
          }}>
            <RefinedSearchInputs handleDate={handleDate} handleSelectChange={handleSelectChange} handleClear={handleClear} handleChange={handleTextChange} handleSubmit={handleButtonSubmit} selectedValue={selectedValue} options={options} activeTabIndex={value} />
          </AccordionDetails>
        </Accordion>
      </Box>}
      <TabPanel
        value={value}
        index={0}
        className={`${styles["tab-pannel-wrapper"]}`}
      >
        <PlacesTab />
      </TabPanel>
      <TabPanel
        value={value}
        index={1}
        className={`${styles["tab-pannel-wrapper"]}`}
      >
        <EventsTab />
      </TabPanel>
      <TabPanel
        value={value}
        index={2}
        className={`${styles["tab-pannel-wrapper"]}`}
      >
        <LibraryTab />
      </TabPanel>
      <TabPanel
        value={value}
        index={3}
        className={`${styles["tab-pannel-wrapper"]}`}
      >
        <MediaTab />
      </TabPanel>
    </div>
  );
};

export default SearchResultTabs;
