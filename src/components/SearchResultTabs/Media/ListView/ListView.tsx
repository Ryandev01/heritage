import { useState, useEffect } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import { ColumnsType } from "antd/lib/table";
import { StyledAntTable } from "../../../StyledAntTable";
import styled from "styled-components";
import { antTablePaginationCss } from "../../../../utils/services/helpers";
import { Loader } from "../../../Loader";
import { MediaProps } from "../GridView/GridView";
import { baseUrl, baseUrlS3, detectMediaTypeFromMediaList, itemAddEditAccess } from '../../../../utils/services/helpers';
import RenderFileData from '../../../RenderFileData';

import { MoreOptionsComponent } from './MoreOption';
import { Media, MediaAttributes } from "../../../../types/Media";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMediaQuery } from 'react-responsive'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setMediaSorting } from '../../../../store/reducers/refinedSearchReducer';

import { setActiveMediaItem, setActiveMediaItemIndex, setSelectedCardIndex, setSelectedKey } from '../../../../store/reducers/searchResultsReducer';

import { useHistory } from "../../../../hooks/useHistory";
import styles from '../GridView/index.module.css'

const StyledTableWrapper = styled(StyledAntTable)`
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

  td {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  }
  .more-menu-ant-cell,
  .more-menu-ant-cell > div,
  .ant-table-tbody > tr > td.more-menu-ant-cell {
    width: 20px !important;
    min-width: 20px !important;
    max-width: 20px !important;
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

  .ant-table-cell.cell-image {
    width: 15vw;
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

  .ant-table-cell iframe {
    height :100%;
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
      right: -5vw !important;
    }

    th.ant-table-cell,
    th.ant-table-cell * {
    }
    td.ant-table-cell {
    }

    .ant-table td {
      font-size: 12px;
      white-space: break-spaces;
    }
    .ant-table th {
      font-size: 13px;
    }

    .ant-table-tbody > tr > td {
      word-wrap: unset;
      word-break: unset;
      white-space: break-spaces;
    }

    .cell-image {
      min-width: 20ch !important;
    }

    .cell-description {
      min-width: 20ch !important;
    }

    .cell-bearing {
      min-width: 18ch !important;
    }
  }
  ${antTablePaginationCss}
`;

const ListView = (props: MediaProps) => {
  const { data, hasMoreData, fetchData, loading, setEdit, isSelect } = props;
  const { selectedKey } = useSelector(
    (state: RootState) => state.searchResults
  );

  const [featuredDirectionAsc, setFeaturedDirectionAsc] = useState(true);

  const handleImageUrl = (url: string, size: string) => {
    // let imagePath = url.split("/");
    // return `${baseUrl}/${imagePath[1]}/${size}${imagePath[2]}`;
    let imagePath = url.split("/");
    // return `${baseUrl}/${imagePath[1]}/${size}${imagePath[2]}`;
    return `${baseUrlS3}/${size}${imagePath[3]}`;
  }

  const isTablet = useMediaQuery({ query: '(min-width: 575px) and (max-width: 1025px)' })
  const { navigateTo } = useHistory()

  // let featuredDirectionAsc = true;
  const handleFilter = (name: string) => {
    
    setFeaturedDirectionAsc(!featuredDirectionAsc);
    dispatch(setMediaSorting([`${name}:${featuredDirectionAsc ? 'asc' : 'desc'}`]));
  }

  const tableHeaderJson: ColumnsType<any> = [
    {
      title: "Image",
      key: "attributes",
      dataIndex: "attributes",
      className: "cell-image",
      width: 150,
      render: (value: MediaAttributes, index: number) => (
        <>
          {/* {value?.object?.data?.attributes ? <Box
            className={`media-table-image`}
            component="img"
            alt={""}
            src={`${baseUrl}${value?.object?.data?.attributes?.url}`}
          ></Box> : <NoImagePresent message={"No image to preview"} />} */}
          <>
            <RenderFileData
              fileData={{
                alt: "",
                src: value.object?.data?.attributes?.url ? handleImageUrl(value.object.data.attributes.url, "thumbnail_") : undefined,
                className: detectMediaTypeFromMediaList({ attributes: value, id: index.toString() }) === "video" ?
                  `${styles['video-card-parent']}` : detectMediaTypeFromMediaList({ attributes: value, id: index.toString() }) === "image" ?
                    `${styles['card-image']}` : `${styles['three-d-card-parent']}`,
                objectURL: value.objectURL || '',
                videoType: value.videoType,
                iframeVideoLink: (value.videoType === "url") ? value.referenceURL : undefined,
                staticVideoLink: (detectMediaTypeFromMediaList({ attributes: value, id: index.toString() }) === "video" && value.videoType === "video") ? `${value.object?.data?.attributes?.url}` : undefined
              }}
              fileType={detectMediaTypeFromMediaList({ attributes: value, id: index.toString() })}
            />
          </>
        </>
      ),
    },

    {
      title: "TITLE",
      key: "attributes",
      dataIndex: "attributes",
      className: "cell-title",
      width: 170,
      render: (value: any, index: any) => value?.title,
    },
    {
      title: "DESCRIPTION",
      key: "attributes",
      dataIndex: "attributes",
      className: "cell-description",
      width: 200,
      render: (value: any, index: any) => value?.description || '',
    },
    {
      title: "TYPE",
      key: "attributes",
      dataIndex: "attributes",
      width: 100,
      render: (value, index) => value?.categoryType?.length > 0 ? value?.categoryType[0] : '',
    },
    {
      title: "BEARING",
      key: "attributes",
      dataIndex: "attributes",
      className: "cell-bearing",
      width: isTablet ? 80 : 60,
      render: (value: any, index: any) => value?.bearing,
    },
    {
      title: "FEATURED",
      key: "attributes",
      dataIndex: "attributes",
      className: "cell-bearing",
      width: isTablet ? 80 : 60,
      // sorter: (a: Media, b: Media) => {
      //   return a?.attributes?.featuredImage.toString().localeCompare(b?.attributes?.featuredImage.toString())
      // },
      sorter: true,
      onHeaderCell: () => {
          return {
          onClick: () => {
              handleFilter('featuredImage');
          }
          };
      },
      render: (value: any, index: any) => {
        return value.featuredImage ? 'Yes' : 'No'
      },
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      width: 20,
      className: "more-menu-ant-cell",
      render: (value: any, record: Media) => (
        itemAddEditAccess &&
        <MoreOptionsComponent id={record.id} record={record} setEdit={setEdit} />
      ),
    },
  ];

  const dispatch = useDispatch()
  useEffect(() => {
    /** locate last row, add id to it; such that
     * its appearance in dom can be tracked and more data can be loaded
     */
    const ele = document.querySelector('#media-list-parent .ant-table-body tbody tr:last-child')

    const removeEle = document.querySelector('#media-list-parent #media-row')

    // reset previously added row id
    if (removeEle) {

      removeEle?.removeAttribute('id')
      // const en = removeEle as HTMLElement
    }

    if (ele) {
      ele.id = "media-row"
    }

  }, [data]);



  useEffect(() => {

    /** Observe if the last row has appeared in the dom,
     * if yes then fetch the data
     */
    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {
        if (data && (data.length > 0) && entry) {
          const intersecting = entry.isIntersecting

          // const en = entry.target as HTMLElement
          if (intersecting) {
            fetchData()
          } else {
          }

        }
      }, {
        root: (() => {
          return document.querySelector('#media-list-parent .ant-table-tbody')
        })(),
        rootMargin: '0px',
        threshold: 1.0
      })
    })

    if(document.getElementById("media-row")) {
      observer.observe(document.getElementById("media-row") as Element)
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }

  }, [data]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    dispatch(setSelectedKey(newSelectedRowKeys))
  };

  const rowSelection = {
    selectedKey,
    onChange: onSelectChange,
  };

  return (
    <Box component="div" id={"media-list-parent"}>
      <StyledTableWrapper
        rowKey={"id"}
        size="small"
        columns={tableHeaderJson}
        dataSource={data}
        rowSelection={isSelect ? rowSelection : undefined}
        pagination={false}
        loading={loading ? loading : false}
        bordered
        scroll={{ y: 500, scrollToFirstRowOnChange: true }}
        style={{
          background: "transparent",
        }}
        onRow={(record: any, rowIndex: number | undefined) => {
          return {
            onClick: (event) => {

              if (typeof rowIndex === "number") {
                dispatch(setActiveMediaItem(record))
                dispatch(setActiveMediaItemIndex(rowIndex))
                // navigate(`/Media/${record.attributes.uniqueId}`, { replace: true })
                navigateTo(`/Media/${record.attributes.uniqueId}`)
              }
            },
          };
        }}
      ></StyledTableWrapper>
      {
        loading &&
        <Loader />
      }
      {
        !hasMoreData && !loading &&
        <p style={{ textAlign: 'center' }}>
          <b>END OF RESULTS</b>
        </p>
      }
    </Box>
  );
};

export default ListView;
