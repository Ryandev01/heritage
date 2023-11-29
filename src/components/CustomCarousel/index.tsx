import { Box, IconButton } from "@mui/material";
import styles from './index.module.css'
import { usePaginatedArray } from "../../hooks/usePaginatedArray";
import { CustomCarouselType } from "../../types/CustomCarouselTypes";
import PrevArrow from '../../assets/images/searchResults/prev-arrow.svg';

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1026 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1025, min: 576 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 575, min: 0 },
        items: 1
    }
};

export const CustomCarousel = ({
    data,
    itemClicked
}: CustomCarouselType) => {

    const {
        // data,
        hasMoreData,
        fetchData
    } = usePaginatedArray({
        apiUrl: 'https://jsonplaceholder.typicode.com/photos',
        step: 10
    })

    const CustomPrevArrow = () => {
        return <>
        <IconButton aria-label="prev" className={`${styles['prev-arsrow']}`}>
            <Box component="img" alt={""} src={PrevArrow} />
        </IconButton>
    </>
    }

    return <>
        <Box component="div" className={`${styles['custom-carousel-wrapper']}`} style={{}}>
            {/* <Carousel
                swipeable={false}
                draggable={false}
                // showDots={true}
                responsive={responsive}
                // ssr={true} // means to render carousel on server-side.
                infinite={true}
                // autoPlay={this.props.deviceType !== "mobile" ? true : false}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                // containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                // deviceType={this.props.deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                // customLeftArrow={<CustomPrevArrow />}
            > */}
                {
                    // data.map((item: any, index: number) => (
                    // ))
                }
            {/* </Carousel> */}
        </Box>
    </>
};
