import { AppBar, Toolbar, Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { CustomModalTypes } from '../../types/CustomModalTypes';
import modalStyles from './index.module.css';
import styled from 'styled-components';

const CustomModal_ = ({
    open,
    handleClose,
    titleContent,
    children
}: CustomModalTypes) => {

    return <>
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            className={`${modalStyles['dialog-wrapper']}`}
            style={{
                background: 'rgba(19, 16, 13, 0.9)',
                zIndex: 'var(--z-index-2)'
            }}
            PaperProps={{
                sx: {
                    '& .MuiDialog-paper': {
                        backgroundColor: 'rgba(19, 16, 13, 0.9)',
                    },
                    '&.MuiPaper-root': {
                        backgroundColor: 'rgba(19, 16, 13, 0.9)',
                    },
                    // to-do
                }
            }}
        >
            <AppBar className={`${modalStyles['modal-header']}`} sx={{ position: 'relative', background: 'rgba(19, 16, 13, 0.9)', boxShadow: 'none' }}>
                <Toolbar sx={{
                    paddingRight: '0 !important'
                }}>
                    {
                        titleContent
                    }
                </Toolbar>
            </AppBar>
            <Box component="div" className={`${modalStyles['content']}`} sx={{
                background: 'rgba(19, 16, 13, 0.9)'
            }}>
                {children}
            </Box>
        </Dialog>
    </>
}

export const CustomModal = styled(CustomModal_)`
    .MuiPaper-root.MuiPaper-elevation.MuiDialog-paper {
        background-color: transparent !important;
    }
`