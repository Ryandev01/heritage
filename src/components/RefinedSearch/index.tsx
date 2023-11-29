import React from 'react';
import { Box, Button } from '@mui/material';
import styled from "styled-components";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import styles from './index.module.css';
import { RefinedSearchProps } from '../../types/RefinedSeachTypes';

const RefinedSearch = ({
    className,
    handleClick
}: RefinedSearchProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleOpen = (event: React.MouseEvent) => {
        setIsOpen(state => !state)
        handleClick(event)
    };

    return (
        <Box component="div" className={`${className} ${styles['refined-search-container']}`} sx={{
            color: '#fff'
        }}>
            <Button
                className={`${styles['refined-search-btn']}`}
                color="inherit"
                size="small"
                sx={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: '1em',
                    textTransform: 'unset',
                    paddingInline: '1em'
                }}
                endIcon={
                    isOpen ?
                        <ArrowBackIosNewOutlinedIcon fontSize='small' sx={{ transform: 'rotate(90deg)' }} /> :
                        <ArrowBackIosNewOutlinedIcon fontSize='small' sx={{ transform: 'rotate(-90deg)' }} />
                }
                onClick={toggleOpen}
            >
                Refined Search
            </Button>
        </Box>
    );
}

const StyledRefinedSearch = styled(RefinedSearch)`
    .hidden-field {
        display: none
    }

`

export default StyledRefinedSearch;