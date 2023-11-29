import { Box } from "@mui/material";
import { RenderFileDataProps } from "../../types/SearchResultsTabsProps";
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import styles from './index.module.css';
import { useState } from "react";
import ReactPlayer from "react-player";
import NoVideoPresent from "../NoDataScreens/NoVideoPresent";
import NoImagePresent from "../NoDataScreens/NoImagePresent";
import { isImagePathInvalid, NO_IMAGE } from "../../utils/services/helpers";
import ThreeDIcon from '../../assets/images/icon-3d-model.svg';
import parse from 'html-react-parser';
import fallBackImg from '../../assets/images/NoImage.png';

export const playIconSx = {
    width: 'fit-content',
    height: '40%',
    color: "black",
    background: 'radial-gradient(circle, rgba(255,255,255,1) 20%, transparent 68%)',
    pointerEvents: 'all'
}
/** component created to erender normal image -video - blob based on props */
const RenderFileDataForGrid = ({
    fileType,
    fileData,
}: RenderFileDataProps) => {

    return (
        <>
            {
                fileType === 'image' &&
                <>
                    {
                        fileData.src
                            &&
                            !isImagePathInvalid(fileData.src)
                            ?
                            <Box
                                className={fileData.className}
                                component="img"
                                alt={fileData.alt ? fileData.alt : ''}
                                src={fileData.src}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = fallBackImg;
                                }}
                            /> :
                            <NoImagePresent
                                className="light-version"
                                message={NO_IMAGE}
                                style={{
                                    // backgroundColor: 'var(--blank-doc-bg)',
                                    color: 'var(--no-map-bg)'
                                }}
                            />
                    }
                </>
            }
            {
                fileType === 'video' &&
                <>
                    <Box component="div"
                        style={{
                            position: 'relative'
                        }}>
                        {(!fileData.src && !fileData.iframeVideoLink && !fileData.staticVideoLink && !fileData.objectURL) ?
                            <NoVideoPresent message="Video not found" style={{
                                minHeight: '150px',
                                height: 'auto'
                            }} /> :
                            // !fileData.isOpened ? <>
                            //     <Box
                            //         className={`${fileData.className} ${fileData.thumbnailClassname}`}
                            //         component="img"
                            //         alt={fileData.alt ? fileData.alt : ''}
                            //         src={fileData.thumbNail}
                            //     />
                            //     <PlayCircleFilledOutlinedIcon
                            //         sx={{
                            //             width: '40%',
                            //             height: '40%',
                            //         }}
                            //         fontSize="large" className={`${styles['video-play-icon']}`}
                            //         onClick={e => {
                            //             e.preventDefault()
                            //             toggleVideoModal(true)
                            //         }}
                            //     />
                            // </> :
                            <>
                                {
                                    fileData.iframeVideoLink ?
                                        <>
                                            {
                                                fileData.iframeVideoLink.indexOf('https://www.youtube.com/watch') !== -1 ?
                                                    <>
                                                        <ReactPlayer
                                                            width="100%" height="auto"
                                                            playing={fileData.isOpened} url={fileData.iframeVideoLink}
                                                            style={{
                                                                aspectRatio: '3/1.65'
                                                            }}
                                                        />
                                                    </> :
                                                    <>
                                                        <iframe title="video-player-iframe" style={{
                                                            width: '100%'
                                                        }}

                                                            src={fileData.iframeVideoLink.replace('/watch', '/embed')}
                                                            onClick={e => {
                                                                if (!fileData.isOpened) {
                                                                    e.preventDefault()
                                                                }
                                                            }}
                                                        >
                                                            {/* {!fileData.isOpened && <>
                                                                <PlayCircleFilledOutlinedIcon
                                                                    sx={{
                                                                        ...playIconSx
                                                                    }}
                                                                    fontSize="large" className={`${styles['video-play-icon']}`}
                                                                    onClick={e => {
                                                                        e.preventDefault()
                                                                    }}
                                                                />
                                                            </>} */}
                                                        </iframe>
                                                    </>
                                            }
                                        </> :
                                        fileData.staticVideoLink ?
                                            <>
                                                <Box component="div" style={{
                                                    position: 'relative'
                                                }}>
                                                    <video width="100%" height="100%"
                                                        controls={fileData.isOpened ? true : false} autoPlay={false}
                                                    >
                                                        <source
                                                            src={fileData.staticVideoLink}
                                                        />

                                                    </video>
                                                    {!fileData.isOpened && <>
                                                        <PlayCircleFilledOutlinedIcon
                                                            sx={{
                                                                ...playIconSx
                                                            }}
                                                            fontSize="large" className={`${styles['video-play-icon']}`}
                                                            onClick={e => {
                                                                e.preventDefault()
                                                            }}
                                                        />
                                                    </>}
                                                </Box>
                                            </> :
                                            <>
                                                {fileData.objectURL ?
                                                    <>
                                                        {
                                                            fileData.objectURL.indexOf('iframe') !== -1 ?
                                                                <>
                                                                    <div dangerouslySetInnerHTML={{ __html: fileData.objectURL }} />
                                                                    {!fileData.isOpened && <>
                                                                        <PlayCircleFilledOutlinedIcon
                                                                            sx={{
                                                                                ...playIconSx
                                                                            }}
                                                                            fontSize="large" className={`${styles['video-play-icon']}`}
                                                                            onClick={e => {
                                                                                e.preventDefault()
                                                                            }}
                                                                        />
                                                                    </>}
                                                                </> :
                                                                <ReactPlayer
                                                                    width="100%" height="100%"
                                                                    playing={false}
                                                                    url={fileData.objectURL}
                                                                    style={{
                                                                        aspectRatio: '3/1.65',
                                                                        pointerEvents: 'none'
                                                                    }}
                                                                />

                                                        }
                                                    </>
                                                    :
                                                    <Box component="div" className={`${styles['video-player-box']}`}>
                                                        <ReactPlayer
                                                            width="100%" height="auto"
                                                            playing={fileData.isOpened} url={fileData.src}
                                                            style={{
                                                                aspectRatio: '3/1.65'
                                                            }}
                                                        />
                                                    </Box>}
                                            </>
                                }
                            </>

                        }
                    </Box>
                </>
            }
            {
                fileType === '3d' &&
                <>
                    <Box component="div"
                        className={fileData.className}
                        style={{
                            position: 'relative',
                            width: '100%'
                        }}>
                        <Box
                            className={`${styles['three-d-model-box']} ${styles[fileData.className]} `}
                            component="div"
                        >
                            {fileData.objectURL ? parse(fileData.objectURL) : ''}
                        </Box>
                        <Box
                            component="img"
                            src={ThreeDIcon}
                            sx={{
                                // width: 1 / 3.6,
                                // height: 1 / 3.6,
                                ...playIconSx,
                                background: 'radial-gradient(circle, rgba(255,255,255,1) 64%, transparent 75%)',
                                padding: '2px'
                            }}
                            className={`${styles['three-model-play-icon']}`}
                        // onClick={e => {
                        //     e.preventDefault()
                        // }}
                        />
                    </Box>
                </>
            }
        </>
    );
}

export default RenderFileDataForGrid;