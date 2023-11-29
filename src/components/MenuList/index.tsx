import { Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import './index.css'

export interface MenuListProps {
    ariaLabelledBy?: string
    anchorEl: HTMLElement | null
    open: boolean
    handleClose: () => void
    options: any
}

const MenuList = ({
    ariaLabelledBy,
    anchorEl,
    open,
    handleClose,
    options
}: MenuListProps) => {

    return (
        <>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': ariaLabelledBy,
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                {options.map((option: any) => (
                    <MenuItem key={option.label}
                        onClick={e => {
                            option.handleClickMenuItem()
                            handleClose()
                        }}>
                        {option.render ? option.render() : option.label}
                    </MenuItem>
                ))}
            </Menu>


        </>
    );
}

export default MenuList;