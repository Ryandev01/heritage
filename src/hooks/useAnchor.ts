import React from 'react'

export const useAnchor = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorElSettings, setAnchorElSettings] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        event.preventDefault()
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSettingsClose = () => {
        setAnchorElSettings(null);
    };

    return {
        anchorEl,
        open,
        handleClick,
        handleClose,
        handleSettingsClose
    }
}