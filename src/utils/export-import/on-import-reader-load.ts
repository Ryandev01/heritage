import { ImportRequestDataType } from "../../types/ImportRequestDataType";
import client from "../services/axiosClient";
import { baseUrl } from "../services/helpers";
import csvToJson from 'csvtojson';
import { Parser } from "json2csv";
import * as XLSX from 'xlsx';
import { Relation } from '../../types/RelationType';
import JSZip from "jszip";

export const onImportReaderLoad = async (
  event: any,
  format: "json" | "csv" | "xlsx",
  slug: string,
  jsonTypes: string[] = [],
  toBeRemovedColumns: string[] = [],
  relations: Relation[] = [],
  zip: any = undefined
) => {
  // Convert xlsx file to csv
  let data;
  if (format === "xlsx") {
    const encodedData = new Uint8Array(event.target.result);
    const workbook = XLSX.read(encodedData, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    data = XLSX.utils.sheet_to_csv(worksheet);
  }

  // assign the csv file
  else if (format === "csv") {
    data = event?.target?.result;
  }
  // assign the json parsed object
  else {
    data = JSON.parse(event?.target?.result);
  }


  // the request data for the import api
  const requestData: ImportRequestDataType = {
    slug: slug,
    format: format === "xlsx" ? "csv" : format,
    data: data,
  };
  try {

    const originalJsonObject = await csvToJson().fromString(requestData.data);
    const jsonObject = [...originalJsonObject];

    const assetConfig = await client.get(
      `${baseUrl}/api/asset-configs?filters[$or][0][typeCode][$eq]=PLACE&filters[$or][0][typeCode][$eq]=VISIT&filters[$or][0][typeCode][$eq]=IMAGE`
    );

    for (let i = 0; i < jsonObject.length; i++) {
      let assetConfigId;
      switch (slug) {
        case "api::place.place":
          assetConfigId = assetConfig.data.data?.find((item: any) => item.attributes.typeCode === "PLACE").id;
          jsonObject[i].asset_config_id = assetConfigId;
          break;
        case "api::visit.visit":
          assetConfigId = assetConfig.data.data?.find((item: any) => item.attributes.typeCode === "VISIT").id;
          jsonObject[i].asset_config_id = assetConfigId;
          break;
        case "api::media.media":
          assetConfigId = assetConfig.data.data?.find((item: any) => item.attributes.typeCode === "IMAGE").id;
          jsonObject[i].media_type = assetConfigId;
          break;
      }
      /* if media, consturct imagemetadata and attach media object */
      if (zip) {
        /* put the imageMetaData properties under the imageMetaData object */
        jsonObject[i].imageMetadata = {};
        if (jsonObject[i]["imageMetadata:latitude"]) {
          jsonObject[i].imageMetadata.latitude = jsonObject[i]["imageMetadata:latitude"]
        }
        if (jsonObject[i]["imageMetadata:Created"]) {
          const dateTime = jsonObject[i]["imageMetadata:Created"].split(" ");
          const dateSplit = dateTime[0].split("/");
          const reformattedDate = dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];
          const time = dateTime[1];
          jsonObject[i].imageMetadata.created = reformattedDate + "T" + time;
        }
        if (jsonObject[i]["imageMetadata:Modified"]) {
          const dateTime = jsonObject[i]["imageMetadata:Modified"].split(" ");
          const dateSplit = dateTime[0].split("/");
          const reformattedDate = dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];
          const time = dateTime[1];
          jsonObject[i].imageMetadata.modified = reformattedDate + "T" + time;
        }
        if (jsonObject[i]["imageMetadata:Depth"]) {
          jsonObject[i].imageMetadata.depth = jsonObject[i]["imageMetadata:Depth"]
        }
        if (jsonObject[i]["imageMetadata:Dimension"]) {
          jsonObject[i].imageMetadata.dimension = jsonObject[i]["imageMetadata:Dimension"]
        }
        if (jsonObject[i]["imageMetadata:File Size"]) {
          jsonObject[i].imageMetadata.fileName = jsonObject[i]["imageMetadata:File Size"]
        }
        if (jsonObject[i]["imageMetadata:Make"]) {
          jsonObject[i].imageMetadata.make = jsonObject[i]["imageMetadata:Make"]
        }
        if (jsonObject[i]["imageMetadata:Model"]) {
          jsonObject[i].imageMetadata.model = jsonObject[i]["imageMetadata:Model"]
        }
        if (jsonObject[i]["imageMetadata:Storage"]) {
          jsonObject[i].imageMetadata.storage = jsonObject[i]["imageMetadata:Storage"]
        }
      }

      /* Convert data to json data type */
      for (let j = 0; j < jsonTypes?.length; j++) {
        jsonObject[i][jsonTypes[j]] = jsonObject[i][jsonTypes[j]] ? `[\"${jsonObject[i][jsonTypes[j]]}\"]` : [];
      }

      /* Remove unnecessary columns */
      for (let k = 0; k < toBeRemovedColumns.length; k++) {
        if (Object.keys(jsonObject[i]).includes(toBeRemovedColumns[k])) {
          delete jsonObject[i][toBeRemovedColumns[k]];
        }
      }

    }
    /* Converts back the json after it is cleared to csv */
    if (jsonObject?.length > 0) {
      const fields = Object.keys(jsonObject[0]);
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(jsonObject);
      requestData.data = csv;
    }

    /* finally send request to the import api */
    const response = await client.post(
      `${baseUrl}/api/import-export-entries/content/import`,
      { ...requestData }
    );

    /* Establish relationship if any relation exist. and upload media if exists*/
    for (let i = 0; i < originalJsonObject.length; i++) {
      for (let j = 0; j < relations?.length; j++) {
        if (originalJsonObject[i]?.[relations[j]?.keyColumn] && originalJsonObject[i]?.[relations[j]?.parentColumn]) {
          const requestBody: any = {};

          const keyData = await client.get(
            `${baseUrl}/api/${relations[j].keyContentType}?filters[$and][0][uniqueId][$eq]=${originalJsonObject[i][relations[j]?.keyColumn]}`
          );
          const parentData = await client.get(
            `${baseUrl}/api/${relations[j].parentContentType}?filters[$and][0][uniqueId][$eq]=${originalJsonObject[i][relations[j]?.parentColumn]}`,
          );
          requestBody[relations[j]?.key] = keyData?.data?.data[keyData?.data?.data.length - 1]?.id;
          requestBody[relations[j]?.parent] = parentData?.data?.data[parentData?.data?.data.length - 1]?.id;;
          if (typeof relations[j]?.extra === "object") {
            const extraKeys = Object.keys(relations[j]?.extra);
            for (let k = 0; k < extraKeys.length; k++) {
              requestBody[extraKeys[k]] = relations[j]?.extra[extraKeys[k]];
            }
          }
          const response = await client.post(
            `${baseUrl}/api/${relations[j].bindingContentType}`,
            { data: { ...requestBody } }
          );
        }

      }

      /* if media upload media and establish relationship with media */
      if (zip) {
        const mediaData = await client.get(
          `${baseUrl}/api/medias?filters[$and][0][uniqueId][$eq]=${originalJsonObject[i]["uniqueId"]}`
        );

        const placeData = await client.get(
          `${baseUrl}/api/places?filters[$and][0][uniqueId][$eq]=${originalJsonObject[i]["idSubject"]}`
        );
        const visitData = await client.get(
          `${baseUrl}/api/visits?filters[$and][0][uniqueId][$eq]=${originalJsonObject[i]["idSubject"]}`,
        );
        const mediaAssociateRequestBody: any = {
          media_unique_id: mediaData?.data?.data[mediaData?.data?.data.length - 1]?.id,
          deleted: false
        };

        if (placeData?.data?.data.length > 0) {
          mediaAssociateRequestBody.place_unique_ids = [placeData?.data?.data[placeData?.data?.data.length - 1]?.id];
        }

        if (visitData?.data?.data.length > 0) {
          mediaAssociateRequestBody.visit_unique_ids = [visitData?.data?.data[visitData?.data?.data.length - 1]?.id];
        }


        const response = await client.post(
          `${baseUrl}/api/media-associates`,
          { data: { ...mediaAssociateRequestBody } }
        );

        const zipFile = await JSZip.loadAsync(zip);
        zipFile.forEach(async (relativePath: any, zipEntry: any) => {
          if (zipEntry.dir === false && zipEntry.name?.substring(zipEntry.name.lastIndexOf(".") + 1) !== "csv" && zipEntry.name?.substring(zipEntry.name.lastIndexOf("/") + 1) === mediaData?.data?.data[mediaData?.data?.data.length - 1]?.attributes?.fileName) {
            const data = await zipEntry.async("blob");
            const fileExtension = zipEntry.name?.substring(
              zipEntry.name.lastIndexOf(".") + 1
            ).toLowerCase();
            let binaryToData = data;
            if (fileExtension === "jpeg" || fileExtension === "jpg") {
              binaryToData = data.slice(0, data.size, "image/jpeg");
            } else if (fileExtension === "png") {
              binaryToData = data.slice(0, data.size, "image/png");
            } else if (fileExtension === "gif") {
              binaryToData = data.slice(0, data.size, "image/gif");
            }
            const formData = new FormData();
            formData.append(
              "files",
              binaryToData,
              zipEntry.name?.substring(zipEntry.name.lastIndexOf("/") + 1)
            );
            formData.append(
              "ref",
              slug,
            );
            formData.append(
              "refId",
              mediaData?.data?.data[mediaData?.data?.data.length - 1]?.id,
            );
            formData.append(
              "field",
              "object",
            );
            await client.post(baseUrl + "/api/upload", formData);
          }
        })
      }

    }
  }

  catch (err) {
    console.log(err);
  }
};
