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
import { playIconSx } from "../RenderFileDataForGrid";
import fallBackImg from '../../assets/images/NoImage.png';

/** component created to erender normal image -video - blob based on props */
const RenderFileData = ({
    fileType,
    fileData,
}: RenderFileDataProps) => {
    const [openVideoModal, toggleVideoModal] = useState<boolean>(false)

    const noVideoCondition  = !fileData.src && !fileData.iframeVideoLink && !fileData.staticVideoLink && !fileData.objectURL

    if(fileType === 'video') {
        // console.log('hex: ', fileData)
    }
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
                                    e.currentTarget.className= `${styles['error-image']}`
                                }}
                            /> :
                            <NoImagePresent
                                className="light-version"
                                message={NO_IMAGE}
                                style={{
                                    backgroundColor: 'var(--blank-doc-bg)',
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
                            position: 'relative',
                            width: noVideoCondition || fileData.objectURL ? '100%' : 'inherit'
                        }}>
                        {(noVideoCondition) ?
                            <NoVideoPresent message="Video not found" style={{
                                ...fileData.noVideoStyles,
                                width: '100%'
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
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = fallBackImg;
                                                                }}
                                                            />
                                                        </> :
                                                        <>
                                                            <iframe title="video-player-iframe" style={{
                                                                width: '100%',
                                                            }}

                                                                src={fileData.iframeVideoLink.replace('/watch', '/embed')}
                                                                onClick={e => {
                                                                    if(!fileData.isOpened) {
                                                                        e.preventDefault()
                                                                    }
                                                                }}
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = fallBackImg;
                                                                }}
                                                        >
                                                            </iframe>
                                                        </>
                                                }
                                            </> :
                                            fileData.staticVideoLink ?
                                                <Box component="div" style={{
                                                    position: 'relative'
                                                }}>
                                                    <video width="100%" height="100%"
                                                        controls={fileData.isOpened ? true : false} autoPlay={false}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = fallBackImg;
                                                        }}
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
                                                    </>
                                                    }
                                                </Box> :
                                                <>
                                                {/* {fileData.objectURL ?
                                                    <>
                                                        {
                                                            fileData.objectURL.indexOf('iframe') !== -1 ?
                                                                <div dangerouslySetInnerHTML={{ __html: fileData.objectURL }} /> :
                                                                <ReactPlayer
                                                                    width="100%" height="100%"
                                                                    playing={false}
                                                                    url={fileData.objectURL}
                                                                    style={{
                                                                        aspectRatio: '3/1.65',
                                                                        pointerEvents: 'none'
                                                                    }}
                                                                    playIcon={
                                                                        <>
                                                                            <PlayCircleFilledOutlinedIcon
                                                                                sx={{
                                                                                    width: 'fit-content',
                                                                                    height: '40%',
                                                                                    background: "rgba(255,255,255,0.5)",
                                                                                    borderRadius: '50%',
                                                                                    pointerEvents: 'all'
                                                                                }}
                                                                                fontSize="large" className={`${styles['video-play-icon']}`}
                                                                                onClick={e => {
                                                                                    e.preventDefault()
                                                                                    // toggleVideoModal(true)
                                                                                }}
                                                                            />
                                                                        </>
                                                                    }
                                                                />

                                                        }
                                                    </>
                                                :
                                                    <Box component="div" className={`${styles['video-player-box']}`}>
                                                        {
                                                            !fileData.isOpened &&
                                                            <PlayCircleFilledOutlinedIcon
                                                                sx={{
                                                                    width: 'fit-content',
                                                                    height: '40%',
                                                                    background: "rgba(255,155,255,0.5)",
                                                                    borderRadius: '50%',
                                                                }}
                                                                fontSize="large" className={`${styles['video-play-icon']}`}
                                                                onClick={e => {
                                                                    e.preventDefault()
                                                                    // toggleVideoModal(true)
                                                                }}
                                                            />
                                                        }
                                                        <ReactPlayer
                                                            width="100%" height="auto"
                                                            playing={fileData.isOpened}
                                                            url={fileData.src}
                                                            style={{
                                                                aspectRatio: '3/1.65'
                                                            }}
                                                        />
                                                    </Box>} */}
                                                {fileData.objectURL ?
                                                    <>
                                                        {
                                                            fileData.objectURL.indexOf('iframe') !== -1 ?
                                                                <>
                                                                    <Box component="div" className={`${styles['direct-html-wrapper']}`}
                                                                        style={{
                                                                            pointerEvents: !fileData.isOpened ? 'none' : 'all'
                                                                        }}
                                                                    >
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
                                                                    </Box>
                                                            </> :
                                                                <ReactPlayer
                                                                    width="100%" height="100%"
                                                                    playing={fileData.isOpened}
                                                                    url={fileData.objectURL}
                                                                    controls={fileData.isOpened}
                                                                    style={{
                                                                        aspectRatio: '3/1.65',
                                                                        pointerEvents:  !fileData.isOpened ? 'none' : 'all'
                                                                    }}
                                                                    onError={(e) => {
                                                                        e.currentTarget.onerror = null;
                                                                        e.currentTarget.src = fallBackImg;
                                                                    }}
                                                                />

                                                        }
                                                    </>
                                                    :
                                                    <Box component="div" className={`${styles['video-player-box']}`}>
                                                        <ReactPlayer
                                                            width="100%" height="auto"
                                                            url={fileData.src}
                                                            playing={fileData.isOpened}
                                                            controls={fileData.isOpened}
                                                            style={{
                                                                aspectRatio: '3/1.65',
                                                                pointerEvents: !fileData.isOpened ? 'none' : 'all'
                                                            }}
                                                            // playIcon={
                                                            //     <>
                                                            //         <PlayCircleFilledOutlinedIcon
                                                            //             sx={{
                                                            //                 width: 'fit-content',
                                                            //                 height: '40%',
                                                            //                 background: "rgba(255,255,255,0.5)",
                                                            //                 borderRadius: '50%',
                                                            //                 pointerEvents: 'all',
                                                            //                 zIndex: 22
                                                            //             }}
                                                            //             fontSize="large" className={`${styles['video-play-icon']}`}
                                                            //             onClick={e => {
                                                            //                 e.preventDefault()
                                                            //                 // toggleVideoModal(true)
                                                            //             }}
                                                            //         />
                                                            //     </>
                                                            // }
                                                            onError={(e) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = fallBackImg;
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
                    className={`${fileData.className} ${styles['three-d-wrapper']}`}
                    style={{
                        position: 'relative'
                    }}>
                        <Box
                            className={`${styles['three-d-model-box']} ${styles[fileData.className]} `}
                            component="div"
                        >
                            {fileData.objectURL ? parse(fileData.objectURL) : ''}
                        </Box>
                        <Box component="div"
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute'
                            }}
                        >
                            {/* <Box
                                component="img"
                                src={ThreeDIcon}
                                sx={{
                                    ...playIconSx,
                                    background: 'radial-gradient(circle, rgba(255,255,255,1) 64%, transparent 75%)',
                                    padding: '2px',
                                    marginTop:"-350px"
                                }}
                                className={`${styles['three-model-play-icon']}`}
                            // onClick={e => {
                            //     e.preventDefault()
                            // }}
                            /> */}
                        </Box>
                    </Box>
                </>
            }
        </>
    );
}

export default RenderFileData;