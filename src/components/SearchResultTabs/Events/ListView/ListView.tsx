import { useState, useEffect, useMemo, useCallback } from 'react';
import { Box } from '@mui/material';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { StyledAntTable } from '../../../StyledAntTable';
import styled from "styled-components";
import { antTablePaginationCss, DETACH_ICON_CLASSNAME, isEventRecordAttached, isRecordAttached, shouldAddAtttachColumnHeader, itemAddEditAccess } from '../../../../utils/services/helpers';
import commonStyles from '../../index.module.css';
import { Loader } from '../../../Loader';
import { EventsProps } from '../GridView/GridView';
import { modifyAssociatedEvents, setSelectedCardIndex, setSelectedKey } from "../../../../store/reducers/searchResultsReducer";
import MoreOptionsComponent from './MoreOption';
import { Event } from '../../../../types/Event';
import { InventoryAssociationType_Event } from '../../../../types/SearchResultsTabsProps';
import DetachedIcon from '../../../Icons/DetachedIcon';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { useHistory } from '../../../../hooks/useHistory';
import { setEventSorting } from '../../../../store/reducers/refinedSearchReducer';

const StyledTableWrapper = styled(StyledAntTable)`
    td
    {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    td.cell-name {
        max-width: 250px;
    }
    td.cell-conserve {
        max-width: 80px;
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
    
    .ant-table-thead > tr > th:not(.ant-table-thead > tr > th.more-menu-ant-cell) ,
    .ant-table-tbody > tr > td:not(.ant-table-tbody > tr > td.more-menu-ant-cell) {
        min-width: 50px;
    }

    th.ant-table-cell {
        white-space: break-spaces;
    }
    .cell-number {
        min-width: 10ch !important;
    }
    .cell-tourism {
        min-width: 18ch !important;
    }
    .cell-recommend {
        min-width: 18ch !important;
    }
    .cell-research{
        min-width: 18ch !important;
    }
    .cell-conserve {
        min-width: 20ch !important;
    }
    .ant-table-cell.more-menu-ant-cell {
        vertical-align:middle;
        min-width: 20px;
        width: 20px;
    }
    .more-menu-div {
        vertical-align:middle;
    }
    .ant-table-thead > tr > th.ant-table-cell-fix-right,
    .ant-table-cell-fix-right {
        background: var(--off-white-background-color);
    }
    
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > thead > tr > th.more-menu-ant-cell.ant-table-cell-fix-right {
        border-left: 1px solid #f0f0f0;
    }

    @media (min-width: 575px) and (max-width: 1025px) {

        .ant-table-thead > tr > th:not(.ant-table-thead > tr > th.more-menu-ant-cell) ,
        .ant-table-tbody > tr > td:not(.ant-table-tbody > tr > td.more-menu-ant-cell) {
            min-width: 90px;
        }

        .ant-table-thead > tr > th.more-menu-ant-cell.ant-table-cell-fix-right ,
        .ant-table-tbody > tr > td.more-menu-ant-cell.ant-table-cell-fix-right {
            right: -5vw !important;
        }

        th.ant-table-cell ,
        th.ant-table-cell * {
        }
        td.ant-table-cell {
        }
        .cell-research{
            min-width: 18ch !important;
        }
        .cell-tourism {
            min-width: 18ch !important;
        }
        .cell-recommend {
            min-width: 18ch !important;
        }
        
        .cell-conserve {
            min-width: 24ch !important;
        }

        .cell-name {
            min-width: 10ch !important;
        }
        
    }
    ${antTablePaginationCss}
`

const ListView = (props: EventsProps) => {
    const dispatch = useDispatch();
    const { navigateTo } = useHistory();
    const { isAssociationsStepOpen, associatedEvents, events, selectedKey } = useSelector(
        (state: RootState) => state.searchResults
    );
    
    let nameDirectionAsc = false;
    let numberDirectionAsc = false;
    const handleFilter = async (name: string) => {
        let direction = true;
        if (name === 'visit_associate.place_unique_id.placeNameEnglish') {
          nameDirectionAsc = !nameDirectionAsc;
          direction = nameDirectionAsc;
        }
        if (name === 'visit_associate.place_unique_id.placeNumber') {
          numberDirectionAsc = !numberDirectionAsc;
          direction = numberDirectionAsc;
        }
        await dispatch(setEventSorting([`${name}:${direction ? 'asc' : 'desc'}`]));
    }

    const [tableHeaderJson, setTableHeaderJson] = useState<ColumnsType<any>>([
        {
            title: "NAME",
            key: `attributes.visit_associate.data.attributes.place_unique_id.data.attributes.placeNameEnglish`,
            dataIndex: "attributes",
            className: 'cell-name',
            // sorter: {
            //     compare: (a: Event, b: Event) => {
            //         return a.attributes.visit_associate.data.attributes.place_unique_id.data.attributes.placeNameEnglish.localeCompare(b.attributes.visit_associate.data.attributes.place_unique_id.data.attributes.placeNameEnglish);
            //     },
            //     multiple: 2,
            // },
            sorter: true,
            onHeaderCell: (column) => {
                return {
                onClick: (e) => {
                    handleFilter('visit_associate.place_unique_id.placeNameEnglish');
                }
                };
            },
            width: 110,
            render: (value: any, index: number) => {
                return `${value.visit_associate?.data?.attributes?.place_unique_id.data?.attributes.placeNameEnglish} ${value.visit_associate.data?.attributes?.place_unique_id?.data?.attributes?.placeNameArabic || ''}`
            },
            filterMultiple: true
        },
        {
            title: "NUMBER",
            key: `attributes.visit_associate.data.attributes.place_unique_id.data.attributes.placeNumber`,
            dataIndex: "attributes",
            className: 'cell-number',
            // sorter: {
            //     compare: (a: Event, b: Event) => {
            //         return a?.attributes?.visit_associate?.data?.attributes?.place_unique_id?.data?.attributes?.placeNumber.localeCompare(b?.attributes?.visit_associate?.data?.attributes?.place_unique_id?.data?.attributes?.placeNumber);
            //     },
            //     multiple: 1,
            // },
            sorter: true,
            onHeaderCell: (column) => {
                return {
                onClick: (e) => {
                    handleFilter('visit_associate.place_unique_id.placeNumber');
                }
                };
            },
            render: (value: any, index: number) => value.visit_associate.data?.attributes.place_unique_id.data?.attributes.placeNumber || '',
            filterMultiple: true
        },
        {
            title: "EVENT NUMBER",
            key: `attributes`,
            dataIndex: "attributes",
            width: 80,
            render: (value: any, index: number) => {
                return `Event ${value.visitNumber}`
            }
        },
        {
            title: "SITE TYPE",
            key: `attributes`,
            dataIndex: "attributes",
            render: (value: any, index: number) => value.visit_associate.data?.attributes.place_unique_id.data?.attributes.siteType.join('; ') || ''
        },
        {
            title: "RESEARCH VALUE",
            key: `attributes`,
            dataIndex: "attributes",
            className: 'cell-research',
            render: (value: any, index: number) => {
                return value?.researchValue.length > 0 ? value?.researchValue.join('; ') : ''
            },
        },
        {
            title: "TOURISM VALUE",
            key: `attributes`,
            dataIndex: "attributes",
            className: 'cell-tourism',
            render: (value: any, index: number) => value?.tourismValue.length > 0 ? value?.tourismValue.join('; ') : ''
            // render: (value: any, index: number) => "Temp"
        },
        {
            title: "STATE OF CONSERVATION",
            key: `attributes`,
            dataIndex: "attributes",
            className: 'cell-conserve',
            render: (value: any, index: number) => value?.stateOfConservation.length > 0 ? value?.stateOfConservation.join('; ') : ''
        },
        {
            title: "RECOMMENDATION",
            key: `attributes`,
            dataIndex: "attributes",
            className: 'cell-recommend',
            render: (value: any, index: number) => value?.recommendation.length > 0 ? value?.recommendation.join('; ') : ''
            // render: (value: any, index: number) => "temp"
        },
        {
            title: "PERIOD",
            key: `attributes`,
            dataIndex: "attributes",
            className: 'cell-period',
            render: (value: any, index: number) => value?.period.length > 0 ? value?.period.join('; ') : ''
        },
        {
            title: "RISK",
            key: `attributes`,
            dataIndex: "attributes",
            render: (value: any, index: number) => value?.risk?.length > 0 ? value?.risk.join('; ') : ''
        },
        {
            title: "",
            key: "action",
            fixed: 'right',
            className: 'more-menu-ant-cell',
            render: (value: any, record: Event) => (
                itemAddEditAccess &&
                <MoreOptionsComponent type="Events" setEdit={props.setEdit} record={record} />
            ),
        },
    ])

    const handleAttachClick = (e: any, record: Event) => {


        if(isEventRecordAttached(record, associatedEvents)) return

        const data: InventoryAssociationType_Event = {
            id: record.id,
            visitNumber: record.attributes.visitNumber,
            placeNameEnglish: record.attributes.visit_associate.data.attributes.place_unique_id.data.attributes.placeNameEnglish,
            placeNameArabic: record.attributes.visit_associate.data.attributes.place_unique_id.data.attributes.placeNameArabic,
            placeNumber: record.attributes.visit_associate.data.attributes.place_unique_id.data.attributes.placeNumber,
            keywords: record.attributes.keywords ? record.attributes.keywords : [],
            previousMediaPresent: record.attributes?.media_associates.data && (record.attributes?.media_associates.data?.length > 0)
        }
        dispatch(modifyAssociatedEvents({
            newItem: data,
            removeId: null
        }))
    }

    const attachIconColumnHeader: any = useMemo(() => ({
        title: "",
        key: "action",
        fixed: 'left',
        width: "50px",
        className: 'more-menu-ant-cell attach-icon',
        render: (value: any, record: Event) => {

            return <Box component="div">
                <DetachedIcon
                    style={{
                        height: '18px',
                        position: 'relative',
                        top: '3px',
                    }}
                    shouldShowAttachIcon={isEventRecordAttached(record, associatedEvents)}
                    onClick={e => {
                        e.stopPropagation();
                        handleAttachClick(e, record)
                    }}
                />
            </Box>
        }
    }), [associatedEvents]
    )

    const { data, handleNext: fetchData, hasMoreData, loading, isSelect } = props;

    useEffect(() => {
        /** locate last row, add id to it; such that
         * its appearance in dom can be tracked and more data can be loaded
         */
        const ele = document.querySelector('#events-list-parent .ant-table-body tbody tr:last-child')

        const removeEle = document.querySelector('#events-list-parent #events-row')

        // reset previously added row id
        if (removeEle) {

            removeEle?.removeAttribute('id')
            // const en = removeEle as HTMLElement
        }

        if (ele) {
            ele.id = "events-row"
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

    }, [isAssociationsStepOpen, associatedEvents]);

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
                    return document.querySelector('#events-list-parent .ant-table-tbody')
                })(),
                rootMargin: '0px',
                threshold: 1.0
            })
        })

        if(document.getElementById("events-row")){
            observer.observe(document.getElementById("events-row") as Element)
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
        <Box component="div" id={'events-list-parent'}>
            {data.length > 0 ? <StyledTableWrapper
                // className={`${styles["table-container"]}`}
                rowKey={"id"}
                rowSelection={isSelect ? rowSelection : undefined}
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
                                // navigate(`/Events/${record.attributes.uniqueId}`, {replace: true})
                                navigateTo(`/Events/${record.attributes.uniqueId}`)
                            }
                        }, // click row
                    };
                }}
                size="small"
                columns={tableHeaderJson}
                dataSource={data}
                pagination={false}
                loading={loading}
                bordered
                // scroll={{ y: 500, scrollToFirstRowOnChange: true }}
                scroll={{ x: 'max-content', y: 350, scrollToFirstRowOnChange: true }}
                style={{
                    background: "transparent",
                }}
            ></StyledTableWrapper> : <h1>No data available</h1>}
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