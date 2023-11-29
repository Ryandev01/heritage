import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialValue = {
  stateOfConservation: [] || undefined,
  period: [],
  recommendation: [],
  researchValue: [],
  tourismValue: [],
  risk: [],
  assessmentType: [],
  artifacts: [],
  actionType: [],
  siteType: [],
  keywords: [],
  recordingTeam: "",
  uniqueId: "",
  fieldNarrative: "",
  visitUIPath: "",
  siteDescription: "",
  assessmentTypeOther: "",
  visitNumber: '',
  asset_config_id: null,
  latitude: undefined,
  longitude: undefined,
  visitDate: undefined,
  createdAt: "",
  updatedAt: "",
  deleted: false,
  id: undefined,
};

export type AddEventState = {
  id: number;
  visitDate?: Date;
  uniqueId: string;
  recordingTeam?: string;
  fieldNarrative?: string;
  visitUIPath?: string;
  visitNumber: Number | null;
  asset_config_id?: Number | null;
  siteDescription?: string;
  siteType?: string[];
  researchValue?: string;
  tourismValue?: string;
  stateOfConservation?: string;
  recommendation?: string;
  risk?: string;
  period?: string[];
  latitude?: Number | null;
  longitude?: Number | null;
  artifacts?: string;
  keywords?: string;
  assessmentType?: string;
  assessmentTypeOther?: string;
};

const initialState: { tabData: any; edit: boolean;
  lastAdded: any | null; } = {
  tabData: initialValue,
  edit: false,
  lastAdded: null
};

export const tabEditSlice = createSlice({
  name: "tab-edit",
  initialState,
  reducers: {
    setTabData: (state, action: PayloadAction<any>) => {
      const copyData = JSON.parse(JSON.stringify(action.payload));
      state.tabData = copyData;
    },
    setTabEdit: (state,action: PayloadAction<boolean>) => {
      state.edit = action.payload;
    },
    setLatestItem: (state,action: PayloadAction<any>) => {
      state.lastAdded = action.payload;
    }
  },
});

export const { setTabData, setTabEdit, setLatestItem } = tabEditSlice.actions;

export default tabEditSlice.reducer;
