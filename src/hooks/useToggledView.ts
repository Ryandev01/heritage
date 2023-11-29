import { useState } from 'react';

type toggleType = {
    count: number
};

export const useToggledView = (props:toggleType) => {
    const [isfirstViewOpen, togglefirstViewOpen] = useState<boolean>(true)
    const [openStates, toggleOpenStates] = useState< Array<boolean>>([true, ...Array(props.count - 1).fill(false)])

    return {
        isfirstViewOpen,
        togglefirstViewOpen,
        openStates,
        toggleOpenStates
    }
}