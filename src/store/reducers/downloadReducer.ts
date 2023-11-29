import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DownloadData, Download } from '../../types/download';

// export const initialValue = {
//     title: "",
//     filePath: "",
//     dataCount: 0,
//     fileCount: 0,
//     libraryCount: 0,
//     visitCount: 0,
//     token: ""
// };

// const initialState: { download: any; downloads: DownloadData[] | [] } = {
//     download: initialValue,
//     downloads: [],
// };
const initialState:DownloadData={
    downloads:[]
}

export const downloadSlice = createSlice({
    name: "download",
    initialState,
    reducers: {
      setDownloads: (state, action: PayloadAction<Download[]>) => {
        state.downloads = action.payload;
      },
    },
});

export const { setDownloads } = downloadSlice.actions;

export default downloadSlice.reducer;