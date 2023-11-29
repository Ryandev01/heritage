import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Options } from "../../types/RefinedSeachTypes";

export const initialSelectedValue = {
  stateOfConservation: [],
  period: [],
  recommendation: [],
  researchValue: [],
  tourismValue: [],
  risk: [],
  assessmentType: [],
  artifacts: [],
  actionType: [],
  siteType: [],
  latitude: '',
  longitude: '',
  startDate: undefined,
  endDate: undefined,
  keyWords: [],
  
}

export type RefinedSearchState = {
  options: Options | null; 
  selectedValue: Options,
  placeSort: string[] | [];
  eventSort: string[] | [];
  mediaSort: string[] | [];
  libSort: string[] | [];
}

const initialState: RefinedSearchState = {
  options: null,
  selectedValue: initialSelectedValue,
  placeSort: [],
  eventSort: [],
  mediaSort: [],
  libSort: [],
};

export const refinedSearchSlice = createSlice({
  name: "searchOptions",
  initialState,
  reducers: {
    setOptions: (state, action: PayloadAction<Options>) => {
      state.options = action.payload;
    },
    setSelectedValue: (state, action: PayloadAction<Options>) => {
      state.selectedValue = action.payload;
    },
    setPlaceSorting: (state, action: PayloadAction<string[]>) => {
      const filterSort = state.placeSort.filter(x => !x.includes(action.payload[0]?.split(':')[0]));
      state.placeSort = [...filterSort, ...action.payload];
    },
    setEventSorting: (state, action: PayloadAction<string[]>) => {
      const filterSort = state.eventSort.filter(x => !x.includes(action.payload[0]?.split(':')[0]));
      state.eventSort = [...filterSort, ...action.payload];
    },
    setMediaSorting: (state, action: PayloadAction<string[]>) => {
      state.mediaSort = action.payload;
    },
    setLibrarySorting: (state, action: PayloadAction<string[]>) => {
      state.libSort = action.payload;
    },
    resetSorting: (state, action: PayloadAction<null>) => {
      state.eventSort = [];
      state.placeSort = [];
      state.mediaSort = [];
      state.libSort = [];
    }
  },
});

export const {
  setOptions,
  setSelectedValue,
  setPlaceSorting,
  setEventSorting,
  setMediaSorting,
  setLibrarySorting,
  resetSorting
} = refinedSearchSlice.actions;

export default refinedSearchSlice.reducer;
