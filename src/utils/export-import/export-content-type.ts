import { ExportRequestDataType } from "../../types/ExportRequestDataType";
import client from "../services/axiosClient";
import { baseUrl } from "../services/helpers";
import { Parser } from "json2csv";

export const exportContentType = async (requestData: ExportRequestDataType) => {
  const filter = requestData?.filter ? requestData?.filter : "";
  try {
    const response = await client.get(
      `${baseUrl}/api/custom/${requestData.collectionTypePlural}`,
      { params: { filter: filter } }
    );
    if (response?.data?.length > 0) {
      const fields = Object.keys(response?.data[0])?.filter((item)=>!(item==="createdBy" || item==="updatedBy"));
      const opts = { fields};
      const parser = new Parser(opts);
      const csv = parser.parse(response?.data?.map((item:any)=>{
        if(item?.updatedBy){
          delete item["updatedBy"];
        }
        if(item?.createdBy){
          delete item["createdBy"];  
        }
      return item;
    }));
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(
        new Blob([csv], { type: "text/csv" })
      );
      a.download = `export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch (err) {
    console.log(err);
  }
};
