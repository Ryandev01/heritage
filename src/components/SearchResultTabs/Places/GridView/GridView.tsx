import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import { useDispatch } from "react-redux";
/** indicating that we can send html later on wherever we parse */
import InfiniteScroll from "react-infinite-scroll-component";
import gridStyles from "./index.module.css";
import commonStyles from "../../index.module.css";
import { setSelectedCardIndex, setSelectedKey } from "../../../../store/reducers/searchResultsReducer";
import {Card} from './Card';
import { Place, PlaceApi } from "../../../../types/Place";
import { useNavigate } from "react-router-dom";
import {formatDateTime} from '../../../../utils/services/helpers';
import { tabNameProps } from "../../../../types/SearchResultsTabsProps";
import { Media } from "../../../../types/Media";
import { Event } from "../../../../types/Event";
import { useHistory } from "../../../../hooks/useHistory";

export type PlacesProps = {
  data: Place[];
  fetchData: () => void;
  hasMoreData: boolean;
  loading: boolean;
  totalData?: number;
  setEdit: (payload:  {record: Place | PlaceApi | Media | Event, type: tabNameProps}) => void;
  isSelect:boolean;
}

let newSelectedKey: any = [];
const GridView = (props: PlacesProps) => {
  const {data, loading, fetchData, hasMoreData, totalData, setEdit, isSelect} = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { navigateTo } = useHistory();

  if (!data) {
    return <h1>loading....</h1>
  }

  if (totalData === 0) {
    return <h1>No data found</h1>
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, keyId:string) => {
    if(event.target.checked){
      newSelectedKey.push(keyId);
    }else{
      let filteredData = newSelectedKey.filter((item:any)=>{return item !== keyId});
      newSelectedKey=filteredData;
    }
    dispatch(setSelectedKey([...newSelectedKey]))
  };

  return (
    <Box component="div" className={`${gridStyles["left-grid-box"]}`}>
      <InfiniteScroll
        dataLength={data.length} //This is important field to render the next data
        next={() => fetchData()}
        hasMore={hasMoreData}
        
        loader={loading ? <h4>Loading...</h4>: null}
        endMessage={
          <p style={{ textAlign: "center", marginTop: 5 }}>
            <b>END OF RESULTS</b>
          </p>
        }
        scrollableTarget={"places-scrollable-div"}
        className={`${commonStyles["infinite-scroll-cls"]}`}
      >
        <Grid
          container
          id={"places-scrollable-div"}
          className={`${gridStyles["left-grid-container"]}`}
        >
          {data?.map((item: Place, index: number) => (
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              { isSelect ? <><Checkbox color="default" onChange={(e)=>handleChange(e, item.id)}/></> : <></> }
                <Grid
                  item
                  key={index}
                  sm={12}
                  className={`${gridStyles["card-grid-item"]}`}
                  onClick={(e) => {
                    dispatch(setSelectedCardIndex(index));
                    // navigate(`/Places/${item.attributes.uniqueId}`, {replace: true})
                    navigateTo(`/Places/${item.attributes.uniqueId}`)
                  }}
                >
              
                  <Card
                    key={index}
                    img={item.attributes?.media_associates?.data[1]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.categoryCode === "MEDIA" && item.attributes?.media_associates?.data[1]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "IMAGE" ? item.attributes?.media_associates?.data[1]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url : ''}
                    // img={item.attributes?.media_associates?.data.find(x => x?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.categoryCode === "MEDIA" && x?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "IMAGE")?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url}
                    title={`${item.attributes?.placeNameEnglish} ${item.attributes?.placeNameArabic} ${item.attributes?.placeNameEnglish || item.attributes?.placeNameArabic ? '-' : ''} ${item.attributes?.placeNumber}`}
                    subTitle={item.attributes?.siteDescription}
                    dateString={`Last updated on ${formatDateTime(item.attributes.updatedAt)}`}
                    period={item?.attributes?.period}
                    setEdit={setEdit}
                    record={item}
                  />
                </Grid>

            </Grid>
          ))}
          
        </Grid>
      </InfiniteScroll>
    </Box>
  );
};

export default GridView;
