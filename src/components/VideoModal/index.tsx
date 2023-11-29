import { Box } from "@mui/material";
import { VideoModalProps } from "../../types/SearchResultsTabsProps";
import styles from './index.module.css'
import { Dialog } from '@mui/material';
import ReactPlayer from 'react-player/lazy'

const VideoModal = ({
    videoSrc,
    isModalOpen,
    toggleModal
}: VideoModalProps) => {
    return (
        <Dialog  fullWidth onClose={toggleModal} open={isModalOpen} sx={{
            '& .MuiPaper-root.MuiDialog-paper' : {
                minWidth: 'fit-content',
                minHeight: 'fit-content'
            }
        }}>
            <Box component="div" className={`${styles['video-player-box']}`}>
                <ReactPlayer playing={isModalOpen} url={videoSrc} />
            </Box>
        </Dialog>
    );
}

export default VideoModal;