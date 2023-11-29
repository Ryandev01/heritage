import { Box, Drawer } from '@mui/material';
import React, { useState } from 'react'
import { CustomDrawerProps } from '../../types/CustomDrawerTypes';

const CustomDrawer = ({
    origin,
    isOpen,
    onClose,
    children
}: CustomDrawerProps) => {

    return (
        <Box component="div" style={{
           textAlign: 'left'
        }} sx={{
            '& .MuiModal-root.MuiDrawer-root': {
                left: 'unset',
            },
            '& .MuiPaper-root.MuiDrawer-paper': {
                zIndex: 'var(--max-z-index)'
            }
        }}>
            <Drawer
                anchor={origin ? origin : "left"}
                open={isOpen}
                hideBackdrop={true}
                disableEnforceFocus
                variant='persistent'
                onClose={onClose}
                style={{
                    left: 'unset'
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        display: 'none'
                    }
                }}
                >
                    {children}
                </Drawer>
        </Box>
    );
}
 
export default CustomDrawer;