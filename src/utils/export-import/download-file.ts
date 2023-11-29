const saveAs = require("file-saver");

export const downloadFile = (fileUrl: string, fileName: string) => {
  saveAs(fileUrl, fileName);
};
