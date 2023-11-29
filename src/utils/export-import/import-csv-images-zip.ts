import JSZip from "jszip";
import { Relation } from "../../types/RelationType";
import client from "../services/axiosClient";
import { baseUrl } from "../services/helpers";
import { onImportReaderLoad } from "./on-import-reader-load";

export const importCsvImagesZip = (file: any, slug: string, jsonTypes: string[] = [],
  toBeRemovedColumns: string[] = [], relations: Relation[] = [], media: boolean = false) => {

  const importCsv = async () => {
    try {
      const csvZip = await JSZip.loadAsync(file);
      csvZip.forEach(async (relativePath, zipEntry) => {
        const extension = zipEntry.name?.substring(zipEntry.name.lastIndexOf(".") + 1).toLowerCase();
        if (extension === "csv" || extension === "xlsx") {
          const data = await zipEntry.async("blob");
          var reader = new FileReader();
          reader.onload = (loadEvent) => {
            onImportReaderLoad(loadEvent, extension, slug, jsonTypes, toBeRemovedColumns, relations, file);
          };
          reader.readAsText(data);
        }
      })
    } catch (error) { console.log(error) }
  }

  /* First upload all files */
  importCsv();

};
