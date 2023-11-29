import { DatePicker, Space } from 'antd';
import {
    Box,
} from "@mui/material";
import styled from 'styled-components';

import './DatePicker.css';

const { RangePicker } = DatePicker;

const StyledWrapper = styled.div`
    
`
export const DateRangePicker = () => {
    return <>
        <StyledWrapper>
            <Box component="div">
                <RangePicker style={{
                    fontFamily: 'Roboto-Regular'
                }}
                    placeholder={['Date Range', '']}
                    separator={<></>}
                />
            </Box>
        </StyledWrapper>
    </>
}