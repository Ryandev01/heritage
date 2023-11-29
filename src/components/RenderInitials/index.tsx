import React from 'react'
import { stringAvatar } from '../../utils/services/helpers';
import { Box, Avatar } from "@mui/material";

const RenderInitials = ({
    firstName, lastName
}: {
    firstName?: string
    lastName?: string
}) => {
    return (
        <Box component="div">
            <>
                {
                    firstName && lastName &&
                    <Avatar>{stringAvatar(`${firstName} ${lastName}`)}</Avatar>
                    // <Box component="div" style={{
                    //     padding: '0.8em 0.6em',
                    //     border: '1px solid black',
                    //     borderRadius: '50%',
                    //     width: 'fit-content'
                    // }}>{stringAvatar(`${firstName} ${lastName}`)}</Box>
                }
                {
                    (!firstName || !lastName) &&
                    <Box component="div" style={{
                        padding: '0.8em 0.6em',
                        border: '1px solid black',
                        borderRadius: '50%',
                        width: 'fit-content'
                    }}>{`U U`}</Box>
                }
            </>
        </Box>
    );
}

export default RenderInitials;