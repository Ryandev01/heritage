import { AutocompleteChangeDetails, AutocompleteChangeReason, SxProps } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React, {ChangeEvent} from "react";

export type RefinedSearchProps = {
    className?: string
    handleClick: (e: React.MouseEvent) => void
}

export type RefinedSearchInputProps = {
    activeTabIndex: number;
    options: Options | null;
    selectedValue: any;
    handleChange: (event: SelectChangeEvent<string | string[]> | ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: ((event: React.SyntheticEvent<Element, Event>, value: string[], reason?: string, details?: AutocompleteChangeDetails<string> | undefined) => void);
    handleSubmit: (e: React.MouseEvent) => void;
    handleClear: (e: React.MouseEvent<HTMLButtonElement>, name?: string) => void;
    handleDate: (date: Date | null, name: string) => void
}
export type BaseInputProps = {
  activeTab: string
  commonSelectSxStyles: SxProps
  commonFormControlSxStyles: SxProps
  textInputSxStyles: SxProps
  options: Options | null;
  selectedValue: any;
  handleSelectChange: ((event: React.SyntheticEvent<Element, Event>, value: string[], reason?: string, details?: AutocompleteChangeDetails<string> | undefined) => void);
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: (e: any, name?: string) => void;
  handleDate: (date: Date | null, name: string) => void
}
export type MediaInputProps = {
  commonSelectSxStyles: SxProps
  commonFormControlSxStyles: SxProps
  textInputSxStyles: SxProps
  options: Options | null;
  selectedValue: any;
  handleSelectChange: ((event: React.SyntheticEvent<Element, Event>, value: string[], reason?: string, details?: AutocompleteChangeDetails<string> | undefined) => void);
  handleChange: (event: SelectChangeEvent<string | string[]> | ChangeEvent<HTMLInputElement>, checked?:boolean) => void;
  handleClear: (e: any, name?: string) => void;
}
export type Translation = {

    id: string;
      code: string;
      locale: Locale[];
  };
  export type option = {
    id: number;
    name: string;
    value: string;
    label: string;
    translation: Translation
  }
  
  export type Options = {
    artifacts: option[] | [];
    actionType: option[] | [];
    assessmentType: option[] | [];
    period: option[] | [];
    recommendation: option[] |[];
    researchValue: option[]|[];
    risk: option[]|[];
    siteType?: option[]|[];
    stateOfConservation: option[]|[];
    tourismValue: option[]|[];
    latitude: string;
    longitude: string;
    startDate?: Date;
    endDate?: Date;
    keyWords?: option[]|[];
  }
  
  
  export type Languages = {
    id: number;
    name: string;
  };
  
  export type Locale = {
    id: number;
    value: string;
    languages: Languages;
  };
  
  