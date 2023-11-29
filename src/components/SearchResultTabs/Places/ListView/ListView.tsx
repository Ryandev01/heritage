import { useState, useEffect, useMemo, useCallback } from "react";
import { Box } from "@mui/material";
import { ColumnsType } from "antd/lib/table";
import { StyledAntTable } from "../../../StyledAntTable";
import styled from "styled-components";
import { antTablePaginationCss, DETACH_ICON_CLASSNAME, isRecordAttached, shouldAddAtttachColumnHeader, itemAddEditAccess } from '../../../../utils/services/helpers';
import { Loader } from '../../../Loader';
import { PlacesProps } from '../GridView/GridView';
import { Place } from "../../../../types/Place";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import DetachedIcon from "../../../Icons/DetachedIcon";
import { useDispatch } from "react-redux";
import { modifyAssociatedPlaces, setSelectedCardIndex, setSelectedKey } from "../../../../store/reducers/searchResultsReducer";
import MoreOptionsComponent from './MoreOption';
import { InventoryAssociationType } from "../../../../types/SearchResultsTabsProps";
import { setPlaceSorting } from "../../../../store/reducers/refinedSearchReducer";
import { useHistory } from "../../../../hooks/useHistory";

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
  .ant-table-thead > tr > th:not(.ant-table-thead > tr > th.more-menu-ant-cell),
  .ant-table-tbody
    > tr
    > td:not(.ant-table-tbody > tr > td.more-menu-ant-cell) {
    min-width: 50px;
  }

  td
{
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
  th.ant-table-cell {
    white-space: break-spaces;
  }
  .cell-number {
    min-width: 10ch !important;
    text-overflow: ellipsis;
  }
  .cell-tourism {
    min-width: 18ch !important;
    text-overflow: ellipsis;
  }
  .cell-research {
    min-width: 18ch !important;
    text-overflow: ellipsis;
  }
  .cell-recommend {
    min-width: 18ch !important;
    text-overflow: ellipsis;
  }

  .cell-period {
    min-width: 15ch !important;
    text-overflow: ellipsis;
  }

  .cell-conserve {
    min-width: 25ch !important;
    text-overflow: ellipsis;
  }
  .ant-table-cell.more-menu-ant-cell {
    vertical-align: middle;
    min-width: 20px;
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
      right: 0vw !important;
    }

    th.ant-table-cell,
    th.ant-table-cell * {
    }
    td.ant-table-cell {
    }
    .cell-research {
      min-width: 18ch !important;
      text-overflow: ellipsis;
    }
    .cell-tourism {
      min-width: 18ch !important;
      text-overflow: ellipsis;
    }
    .cell-recommend {
      min-width: 18ch !important;
      text-overflow: ellipsis;
    }

    .cell-conserve {
      min-width: 25ch !important;
      text-overflow: ellipsis;
    }

    .cell-name {
      min-width: 10ch !important;
      text-overflow: ellipsis;
    }
  }
  ${antTablePaginationCss}
`;

const ListView = (props: PlacesProps) => {
  const dispatch = useDispatch();
  const { navigateTo } = useHistory();
  const { isAssociationsStepOpen, associatedPlaces, selectedKey } = useSelector(
    (state: RootState) => state.searchResults
  );
  const { data, hasMoreData, fetchData, loading, isSelect } = props;
  
  let nameDirectionAsc = false;
  let numberDirectionAsc = false;
  const handleFilter = async (name: string) => {
    let direction = true;
    if (name === 'placeNameEnglish') {
      nameDirectionAsc = !nameDirectionAsc;
      direction = nameDirectionAsc;
    }
    if (name === 'placeNumber') {
      numberDirectionAsc = !numberDirectionAsc;
      direction = numberDirectionAsc;
    }
   
    await dispatch(setPlaceSorting([`${name}:${direction ? 'asc' : 'desc'}`]));
  }

  const [tableHeaderJson, setTableHeaderJson] = useState<ColumnsType<any>>([
    {
      title: "NAME",
      key: `attributes.placeNameEnglish`,
      dataIndex: "attributes",
      className: 'cell-name',
      sorter: true,
      onHeaderCell: (column) => {
        return {
          onClick: (e) => {
            handleFilter('placeNameEnglish');
          }
        };
      },
      render: (value: any, index: number) => {
        return `${value.placeNameEnglish} ${value.placeNameArabic}`
      }
    },
    {
      title: "NUMBER",
      key: `attributes.placeNumber`,
      dataIndex: "attributes",
      className: 'cell-number',
      sorter: true,
      onHeaderCell: (column) => {
        return {
          onClick: (e) => {
            handleFilter('placeNumber');
          }
        };
      },
      // sorter: {
      //   compare: (a: { attributes: { placeNumber: string; } }, b: { attributes: { placeNumber: string; } }) => {
      //     return a.attributes.placeNumber.localeCompare(b.attributes.placeNumber)
      //   },
      //   multiple: 1
      // },
      // filterMultiple: true,
      render: (value: any, index: number) => value.placeNumber
    },
    {
      title: "TYPE",
      key: `attributes`,
      dataIndex: "attributes",
      render: (value: any, index: number) => value?.siteType.map((x: string) => `${x}`)
    },
    {
      title: "RESEARCH VALUE",
      key: `attributes`,
      dataIndex: "attributes",
      className: 'cell-research',
      render: (value: any, index: number) => {
        return value.researchValue
      },
    },
    {
      title: "TOURISM VALUE",
      key: `attributes`,
      dataIndex: "attributes",
      className: 'cell-tourism',
      render: (value: any, index: number) => value.tourismValue.map((x: string) => `${x}`)
    },
    {
      title: "STATE OF CONSERVATION",
      key: `attributes`,
      dataIndex: "attributes",
      className: 'cell-conserve',
      render: (value: any, index: number) => value.stateOfConservation.map((x: string) => `${x}`)
    },
    {
      title: "RECOMMENDATION",
      key: `attributes`,
      dataIndex: "attributes",
      className: 'cell-recommend',
      render: (value: any, index: number) => value.recommendation.map((x: string) => `${x}`)
    },
    {
      title: "PERIOD",
      key: `attributes`,
      dataIndex: "attributes",
      className: 'cell-period',
      render: (value: any, index: number) => value.period.map((x: string) => `${x}`)
    },
    {
      title: "RISK",
      key: `attributes`,
      dataIndex: "attributes",
      render: (value: any, index: number) => value.risk.map((x: string) => `${x}`)
    },
    {
      title: "",
      key: "action",
      fixed: 'right',
      className: 'more-menu-ant-cell',
      render: (value: any, record: Place) => (
        itemAddEditAccess && <MoreOptionsComponent type="Places" setEdit={props.setEdit} record={record} />
      ),
    },
  ])

  const handleAttachClick = (e: any, record: Place) => {

    if(isRecordAttached(record, associatedPlaces)) return

    const data: InventoryAssociationType = {
      id: Number(record.id),
      placeNameEnglish: record.attributes.placeNameEnglish,
      placeNameArabic: record.attributes.placeNameArabic,
      placeNumber: record.attributes.placeNumber,
      keywords: record.attributes.keywords ? [...record.attributes.keywords] : [],
      previousMediaPresent: record.attributes?.media_associates.data && (record.attributes?.media_associates.data?.length > 0)
    }
    dispatch(modifyAssociatedPlaces({
      newItem: data,
      removeId: null
    }))
  }

  const attachIconColumnHeader: any = useMemo(() => ({
    title: "",
    key: "action",
    dataIndex: "attributes",
    fixed: 'left',
    className: 'more-menu-ant-cell attach-icon',
    render: (value: any, record: Place) => {

      return <Box component="div">
        <DetachedIcon
          style={{
            height: '18px',
            position: 'relative',
            top: '3px',
          }}
          shouldShowAttachIcon={isRecordAttached(record, associatedPlaces)}
          onClick={e => {
            e.stopPropagation();
            handleAttachClick(e, record)
          }}
        />
      </Box>
    }
  }), [associatedPlaces]
  )

  useEffect(() => {

    /** locate last row, add id to it; such that
     * its appearance in dom can be tracked and more data can be loaded
     */
    const ele = document.querySelector('#places-list-parent .ant-table-body tbody tr:last-child')

    const removeEle = document.querySelector('#places-list-parent #places-row')

    // reset previously added row id
    if (removeEle) {

      removeEle?.removeAttribute('id')
      // const en = removeEle as HTMLElement
    }

    if (ele) {
      ele.id = "places-row"
    }

  }, [data]);

  /** Effect needed to refresh the headers, 
  * when associations have changed.
  */
  useEffect(() => {

    /** set default headers */
    setTableHeaderJson(state => state.filter(item => {
      return shouldAddAtttachColumnHeader(item)
    }))

    if (isAssociationsStepOpen) {

      /** refresh headers for re-render*/
      setTableHeaderJson(state => {
        let newState = [...state]
        if (newState.every(item => shouldAddAtttachColumnHeader(item))) {
          newState = [attachIconColumnHeader, ...state]
        }

        return newState
      })
    }

  }, [isAssociationsStepOpen, associatedPlaces]);

  useEffect(() => {

    /** Observe if the last row has appeared in the dom,
     * if yes then fetch the data
     */
    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {
          if(data && (data.length > 0) && entry) {
            const intersecting = entry.isIntersecting
            
            // const en = entry.target as HTMLElement
            if (intersecting) {
              fetchData();
            } else {
            }

          }
        }, {
          root: (() => {
            return document.querySelector('#places-list-parent .ant-table-tbody')
          })(),
          rootMargin: '0px',
          threshold: 1.0
        })
      })
      
      if(document.getElementById("places-row")) {
        observer.observe(document.getElementById("places-row") as Element)
      }
  
      return () => {
        if(observer) {
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

  const renderTable = useMemo(() => <StyledTableWrapper
  rowKey={"id"}
  size="small"
  columns={tableHeaderJson}
  dataSource={data}
  pagination={false}
  loading={loading}
  rowSelection={isSelect ? rowSelection : undefined}
  bordered
  scroll={{ x: 'max-content', y: 350 }}
  style={{
    background: "transparent",
  }}
  onRow={(record: any, rowIndex) => {
    return {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as Element;
        const clsList = target.classList

        if ([...clsList].includes(DETACH_ICON_CLASSNAME)) {
          event.stopPropagation();
          handleAttachClick(event, record)
        } else {
          dispatch(setSelectedCardIndex(rowIndex || record.id))
          navigateTo(`/Places/${record.attributes.uniqueId}`)
        }
      }, // click row
    };
  }}
/>, [tableHeaderJson, data, isSelect])
  return (
    <Box component="div" id={'places-list-parent'}>
      {renderTable}
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
}

export default ListView;
