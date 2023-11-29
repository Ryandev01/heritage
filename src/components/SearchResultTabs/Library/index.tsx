import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import styles from "../index.module.css";
import libStyles from "./index.module.css";
import Button from "../../../components/Button";
import type { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import LinkIcon from "@mui/icons-material/Link";
import { StyledAntTable } from "../../StyledAntTable";
import InfiniteScroll from "react-infinite-scroll-component";
import commonStyles from "../index.module.css";
import useLibrary from "../../../hooks/useLibrary";
import { Meta } from "../../../types/Place";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import {
  formatWebDate,
  formatBytes,
  antTablePaginationCss,
  checkSearchParameter,
  itemAddEditAccess
} from "../../../utils/services/helpers";
import MoreOptionsComponent from "../Places/ListView/MoreOption";
import { Media } from "../../../types/Media";
import { HtmlTooltip } from "../../../components/Tooltip";
import { Typography } from "@mui/material";
import { setSelectedCardIndex, setIsSelect, setSelectedKey } from "../../../store/reducers/searchResultsReducer";
import { setLibrarySorting } from "../../../store/reducers/refinedSearchReducer";

import { useDispatch } from "react-redux";
import ExportModal from "../../ExportModal";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "../../../hooks/useHistory";

const StyledTableWrapper = styled(StyledAntTable)`
  td {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ant-table-container {
  }
  .ant-table {
    margin-block: 2em;
  }
  thead tr th:first-child .ant-checkbox-inner::after {
    background-color: rgba(19, 16, 13, 0.9);
    border-color: 1px solid #E8E9E9;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: rgba(19, 16, 13, 0.9);
    border-color: 1px solid #E8E9E9;
  }

  .ant-table-thead > tr > th:not(.ant-table-thead > tr > th.more-menu-ant-cell),
  .ant-table-tbody
    > tr
    > td:not(.ant-table-tbody > tr > td.more-menu-ant-cell) {
    min-width: 50px;
  }

  th.ant-table-cell {
    white-space: break-spaces;
  }
  .ant-table-cell.more-menu-ant-cell {
    vertical-align: middle;
    min-width: 20px;
    width: 20px;
  }
  .more-menu-ant-cell,
  .more-menu-ant-cell > div {
    width: 20px;
  }
  .more-menu-div {
    vertical-align: middle;
  }
  .ant-table-thead > tr > th.ant-table-cell-fix-right,
  .ant-table-cell-fix-right {
    background: var(--off-white-background-color);
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    > thead
    > tr
    > th.more-menu-ant-cell.ant-table-cell-fix-right {
    border-left: 1px solid #f0f0f0;
  }

  .ant-table-tbody > tr > td {
    word-wrap: unset;
    word-break: unset;
    white-space: break-spaces;
  }

  .media-table-image {
    object-fit: cover;
    width: 100%;
    aspect-ratio: 3/2;
  }
  .ant-table-cell {
    vertical-align: middle;
  }
  .ant-table-tbody > tr > td.more-menu-ant-cell {
    min-width: unset;
  }

  @media (min-width: 575px) and (max-width: 1025px) {
    .ant-table-thead
      > tr
      > th:not(.ant-table-thead > tr > th.more-menu-ant-cell),
    .ant-table-tbody
      > tr
      > td:not(.ant-table-tbody > tr > td.more-menu-ant-cell) {
      min-width: 90px;
    }

    .ant-table-thead > tr > th.more-menu-ant-cell.ant-table-cell-fix-right,
    .ant-table-tbody > tr > td.more-menu-ant-cell.ant-table-cell-fix-right {
      right: -2vw !important;
    }

    .ant-table-tbody > tr > td.more-menu-ant-cell {
      min-width: unset;
    }

    th.ant-table-cell,
    th.ant-table-cell * {
    }

    .cell-image {
      min-width: 20ch !important;
    }

    .cell-description {
      min-width: 20ch !important;
    }
  }
  ${antTablePaginationCss}
`;
const LibraryTab = () => {
  const { searchApply, library, searchText, totalCounts, libararyMetaData, isSelect, selectedKey } =
    useSelector((state: RootState) => state.searchResults);
  const { selectedValue } = useSelector(
    (state: RootState) => state.refinedSearch
  );
  const isTablet = useMediaQuery({
    query: "(min-width: 575px) and (max-width: 1025px)",
  });

  const dispatch = useDispatch();
  const { navigateTo } = useHistory();
  const [nameDirectionAsc, setNameDirectionAsc] = useState(true);

  const { fetchLibraryItems, hasMoreData, loading, setEdit, searchData } =
    useLibrary();

    const handleFilter = (name: string) => {
    
      setNameDirectionAsc(!nameDirectionAsc);
      dispatch(setLibrarySorting([`${name}:${nameDirectionAsc ? 'asc' : 'desc'}`]));
    }
  const tableHeaderJson: ColumnsType<any> = [
    {
      title: "NAME",
      key: "attributes",
      dataIndex: "attributes",
      width: 200,
      sorter: true,
      onHeaderCell: () => {
        return {
        onClick: () => {
            handleFilter('title');
        }
        };
    },
      // sorter: (a, b) =>
      //   a?.attributes?.title?.localeCompare(b?.attributes?.title),
      // defaultSortOrder: "ascend",
      className: "name-column",
      render: (value: any, record: any) => (
        <Box
          component="div"
          sx={{
            display: "flex",
            gap: "1em",
          }}
        >
          <InsertDriveFileOutlinedIcon fontSize="small" />
          <Box component="div">{value.title}</Box>
        </Box>
      ),
    },
    {
      title: "DESCRIPTION",
      key: "attributes",
      width: 300,
      className: "description-column",
      //   dataIndex: "description",
      dataIndex: "attributes", // temporary
      render: (value: any, index) => {
        // temporary
        return value.description;
      },
    },
    {
      title: "CITATION",
      className: "citation-column",
      width: 300,
      //   dataIndex: "citation",
      dataIndex: "attributes", // temporary
      render: (value: any, index) => {
        // temporary
        return value.citation;
      },
      //   width: viewWidths[2],
    },
    {
      title: "URL",
      key: "attributes",
      width: 300,
      //   dataIndex: "url",
      dataIndex: "attributes", // temporary
      render: (value, index) => (
        <Box
          component={"a"}
          sx={{
            color: "initial",
            textDecoration: "underline",
          }}
        >
          <HtmlTooltip
            title={
              <div className={`${styles["reference-url"]}`}>
                <div className={`${styles["link"]}`}>
                  <LinkIcon sx={{ color: "white" }} />
                </div>
                <a href={value.referenceURL} target="_blank">
                  <Typography style={{ fontSize: 12, margin: 1 }} color="white">
                    {value.referenceURL}
                  </Typography>
                </a>
              </div>
            }
          >
            <Typography color="inherit">{value.referenceURL}</Typography>
          </HtmlTooltip>
        </Box>
      ),
    },
    {
      title: "SIZE",
      key: "attributes",
      dataIndex: "attributes",
      width: 100,
      render: (value, index) =>
        formatBytes(value.object?.data?.attributes?.size || 0, 2),
    },
    {
      title: "",
      key: "action",
      dataIndex: "id",
      width: isTablet ? 40 : 20,
      fixed: "right",
      className: "more-menu-ant-cell",
      render: (value: any, record: Media) => (
        itemAddEditAccess &&
        <MoreOptionsComponent
          type="Library"
          setEdit={setEdit}
          record={record}
        />
      ),
    },
  ];
  const [filter, setFilter] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    /** Needs to be done , since InfiniteSCroll needs a relation with
     * div being scrolled. Here its tbody of ant table
     */
    dispatch(setIsSelect(false));
    const ele = document.querySelector("#library-list-parent .ant-table-body");
    if (ele) {
      ele.id = "library-list-div";
    }
  }, []);
  const meta: Meta | null = libararyMetaData;

  const handleNext = () => {
    fetchLibraryItems();
  };

  if (!library) {
    return <h1>No data found</h1>;
  }

  /* Event hanlders */
  const exportLibrary = async () => {
    let filter: any = {
      media_type: {
        categoryCode: {
          $containsi: "LIBRARY",
        },
      },
    };
    if (searchData?.search) {
      filter = {
        ...filter,
        $or: [
          {
            title: {
              $containsi: searchData.search,
            },
          },
          {
            description: {
              $containsi: searchData.search,
            },
          },
          {
            fileName: {
              $containsi: searchData.search,
            },
          },
          {
            citation: {
              $containsi: searchData.search,
            },
          },
          ,
        ],
        $and:[
          {
            deleted:{$eq:false}
          }
        ]
      };
    }else{
      filter = {
        $and:[
          {
            deleted:{$eq:false}
          }
        ]
    };
  }
    setFilter(filter);
    setOpen(true);
  };
  const showResults =
    checkSearchParameter(searchText, selectedValue) && searchApply;

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    dispatch(setSelectedKey(newSelectedRowKeys))
  };

  const rowSelection = {
    selectedKey,
    onChange: onSelectChange,
  };

  return (
    <Box component="div" className={`${styles["main-tab-content"]}`}>
      <Box component="div" className={`${styles["utility-bar"]}`}>
        <Box component="div">
          {" "}
          {showResults && meta?.pagination?.total ? `${meta?.pagination?.total} Results | ` : null}
          {totalCounts?.library} Total Library Items
        </Box>
        <Box component="div" className={`${libStyles["btns-flex"]}`}>
          <Button
            colors={[
              "transparent",
              "var(--table-black-text)",
              "var(--table-black-text)",
            ]}
            className={`${styles["export-btn"]}`}
            label={isSelect ? "Cancel" : "Select"}
            style={{
              border: "1px solid var(--light-grey-border)",
              borderRadius: "40px",
              padding: "0.2em 15px",
              lineHeight: "2",
              height: "100%",
              textAlign: "center",
            }}
            onClick={() => { dispatch(setIsSelect(!isSelect)) }}
          />
          <Button
            colors={[
              "transparent",
              "var(--table-black-text)",
              "var(--table-black-text)",
            ]}
            className={`${styles["export-btn"]}`}
            label="Export"
            style={{
              border: "1px solid var(--light-grey-border)",
              borderRadius: "40px",
              padding: "0.2em 15px",
              lineHeight: "2",
              height: "100%",
              textAlign: "center",
            }}
            onClick={exportLibrary}
          />
        </Box>
      </Box>
      <ExportModal
        open={open}
        setOpen={setOpen}
        count={meta?.pagination?.total}
        path={"medias"}
        filter={filter}
        isLibrary={true}
      />
      <Box component="div" id={"library-list-parent"}>
        <InfiniteScroll
          dataLength={library.length} //This is important field to render the next data
          next={() => handleNext()}
          hasMore={hasMoreData}
          loader={loading ? <h4>Loading...</h4> : null}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>END OF RESULTS</b>
            </p>
          }
          scrollableTarget={"library-list-div"}
          className={`${commonStyles["infinite-scroll-cls"]}`}
        >
          <StyledTableWrapper
            className={`${styles["table-container"]}`}
            rowKey={"id"}
            size="small"
            columns={tableHeaderJson}
            dataSource={library}
            rowSelection={isSelect ? rowSelection : undefined}
            pagination={false}
            loading={loading ? loading : false}
            bordered
            scroll={{
              x: "max-content",
              y: 500,
              scrollToFirstRowOnChange: true,
            }}
            style={{
              background: "transparent",
            }}
            onRow={(record: any, rowIndex) => {
              return {
                onClick: (event: React.MouseEvent<HTMLElement>) => {
                  dispatch(setSelectedCardIndex(rowIndex || record.id));
                  // navigate(
                  //   `/Library/${record.attributes.uniqueId}`,
                  //   { replace: true }
                  // );
                  navigateTo(
                    `/Library/${record.attributes.uniqueId}`
                  );
                },
              };
            }}
          ></StyledTableWrapper>
        </InfiniteScroll>
      </Box>
      <ExportModal
        open={open}
        setOpen={setOpen}
        count={meta?.pagination?.total}
        path={"medias"}
        filter={filter}
        isLibrary={true}
      />
    </Box>
  );
};

export default LibraryTab;
