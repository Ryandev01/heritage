import Box from "@mui/material/Box";
/** indicating that we can send html later on wherever we parse */
import parse from "html-react-parser";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import { format } from "date-fns";
import { Event } from '../../../../types/Event'
import { MediaAssociateObj } from '../../../../types/Place'
import { Media } from '../../../../types/Media'
import gridStyles from './index.module.css'
import commonStyles from '../../index.module.css'
import MoreIcon from '../../../../assets/images/searchResults/MoreMenu.svg'
import InfiniteScroll from 'react-infinite-scroll-component';
import { setSelectedCardIndex,setSelectedKey } from "../../../../store/reducers/searchResultsReducer";
import { Card } from './Card';
import dayjs from "dayjs";
import { tabNameProps } from "../../../../types/SearchResultsTabsProps";
import { useHistory } from "../../../../hooks/useHistory";

export type EventsProps = {
    data: Event[];
    handleNext: () => void;
    hasMoreData: boolean;
    loading: boolean;
    setEdit: (payload: { record: Event | Media | MediaAssociateObj, type: tabNameProps }) => void,
    isSelect:boolean;
}
let newSelectedKey:any = [];
const GridView = (props: EventsProps) => {
    const dispatch = useDispatch();
    const { navigateTo } = useHistory();
    const { data, handleNext, hasMoreData, loading, setEdit, isSelect } = props;
    if (!data) {
        return <h1>Loading...</h1>
    }

    const checkIsNew = (updatedDate: string) => {
        const expDate = dayjs(updatedDate).add(30, "d").toDate();
        return dayjs().isBefore(expDate);
    }

    const handleClick = (item: Event, index: number) => {
        dispatch(setSelectedCardIndex(index))
        // navigate(`/Events/${item.attributes.uniqueId}`, { replace: true })
        navigateTo(`/Events/${item.attributes.uniqueId}`)
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
        <Box component="div" className={`${gridStyles['']}`}
        >
            <InfiniteScroll
                dataLength={data.length} //This is important field to render the next data
                next={() => handleNext()}

                hasMore={hasMoreData}

                loader={loading ? <h4>Loading...</h4> : null}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>END OF RESULTS</b>
                    </p>
                }
                scrollableTarget={'events-scrollable-div'}
                className={`${commonStyles['infinite-scroll-cls']}`}
            >

                <Grid container id={'events-scrollable-div'} className={`${gridStyles['left-grid-container']}`}>
                    {
                        data?.map((item: Event, index: number) =>(
                            <Grid
                                container
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                { isSelect ? <><Checkbox color="default" onChange={(e)=>handleChange(e, item.id)}/></> : <></> }

                                <Grid item className={`${gridStyles['card-grid-item']}`} key={index} sm={12} onClick={() => handleClick(item, index)}>
                                    <Card
                                        key={index}
                                        /** TO-DO: 1 used since 0th data was coming null, to be fixed from backend */
                                        img={item.attributes?.media_associates?.data[1]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.categoryCode === "MEDIA" && item.attributes?.media_associates?.data[1]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "IMAGE" ? item.attributes?.media_associates?.data[1]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url : ''}

                                        title={item?.attributes?.visit_associate.data?.attributes?.place_unique_id ? `${
                                            item?.attributes?.visit_associate.data?.attributes?.place_unique_id?.data?.attributes?.placeNameEnglish
                                        } ${
                                            item.attributes.visit_associate.data?.attributes?.place_unique_id?.data?.attributes?.placeNameArabic
                                        } ${
                                            item?.attributes?.visit_associate.data?.attributes?.place_unique_id?.data?.attributes?.placeNameEnglish || 
                                            item.attributes.visit_associate.data?.attributes?.place_unique_id?.data?.attributes?.placeNameArabic ? '-' : ''} ${item.attributes.visit_associate.data?.attributes?.place_unique_id?.data?.attributes?.placeNumber}` : ''}
                                        subTitle={item?.attributes?.siteDescription || ''}
                                        dateString={
                                            item?.attributes?.visitDate ?
                                                `${format(
                                                    new Date(item?.attributes?.visitDate),
                                                    "MM/dd/yyyy"
                                                )}` : ''
                                        }
                                        isNew={checkIsNew(item.attributes.visitDate)}
                                        handleClick={handleClick}
                                        record={item}
                                        id={item.id}
                                        setEdit={setEdit}
                                    />
                                </Grid>
                            </Grid>
                        )
                            
                        )
                    }
                </Grid>
            </InfiniteScroll>
        </Box>
    );
}

export default GridView;
