import { Relation } from "../../types/RelationType";
import { onImportReaderLoad } from "./on-import-reader-load";

export const importContentType = (file: any, slug: string, jsonTypes: string[] = [],
  toBeRemovedColumns: string[] = [],relations:Relation[] = []) => {
  var reader = new FileReader();
  const fileName = file?.name;
  reader.onload = (loadEvent) => {
    onImportReaderLoad(
      loadEvent,
      fileName?.substring(fileName.lastIndexOf(".") + 1),
      slug,
      jsonTypes,
      toBeRemovedColumns,
      relations
    );
  };

  if (fileName?.substring(fileName.lastIndexOf(".") + 1) === "xlsx") {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }

};
