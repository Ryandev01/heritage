import React from 'react'
import {
    Box,
} from "@mui/material";

type FormErrorTypes = {
    msg: string,
    style?: React.CSSProperties
}

const FormError = ({
    msg,
    style = {}
}: FormErrorTypes) => {
    return (
        <Box component="div" style={{
            ...style,
            fontSize: 'smaller',
            lineHeight: 1,
            color: 'var(--orange-shade)',
            textAlign: 'left'
        }}>
            {msg}
        </Box>
    );
}

export default FormError;