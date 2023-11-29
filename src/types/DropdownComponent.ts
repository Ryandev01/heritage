import { AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteRenderOptionState, SxProps } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { ChangeEvent, ChangeEventHandler, MouseEvent } from 'react';

export type DropdownCompProps = {
    className?: string
    label?: string
    placeholder?: string
    selectStylesSx?: SxProps
    formControlSx?: SxProps
    value: string[] | string | undefined
    handleChange?: ((event: SelectChangeEvent<string | string[]> | ChangeEvent<HTMLInputElement>, child: React.ReactNode) => void)
    handleSelectChange?: ((event: React.SyntheticEvent<Element, Event>, value: string[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string> | undefined) => void) | undefined;
    handleClear?: (e: MouseEvent<HTMLButtonElement>) => void;
    itemsList: Array<dropDownItem> | []
    name?: string
    multiple?: boolean;
}
export interface Multiple {
    multiple: boolean
}
export interface AutoCompleteMultiSelectProps {
    className?: string
    label?: string
    placeholder?: string
    selectStylesSx?: SxProps
    formControlSx?: SxProps
    handleChange?: ((event: SelectChangeEvent<string | string[]> | ChangeEvent<HTMLInputElement>, child: React.ReactNode) => void)
    value: string[] | undefined
    handleSelectChange?: (event: React.SyntheticEvent<Element, Event>, value: string[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string> | undefined) => void;
    handleClear: (e: MouseEvent<HTMLButtonElement>) => void;
    itemsList: Array<dropDownItem> | []
    name?: string
    multiple?: boolean;
}
export interface AutoCompleteSingleSelectProps extends Omit<AutoCompleteMultiSelectProps, "value" | "handleSelectChange" | "handleChange"> {
    value?: object | any
    defaultValue?: object | any
    handleChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    handleSelectChange?: (event: React.SyntheticEvent<Element, Event>, value: string | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string> | undefined) => void;
    renderOption?: ((props: React.HTMLAttributes<HTMLLIElement>, option: string, state: AutocompleteRenderOptionState) => React.ReactNode)
}

export type dropDownItem = {
    label: string
    value: string
}