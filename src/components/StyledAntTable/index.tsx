import { Table } from "antd";
import styled from "styled-components";

export const StyledAntTable = styled(Table)`
    
    th,
    .cellnowrap {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .ant-table-fixed {
        table-layout: fixed;
    }

    .ant-table {
        font-family: 'Roboto-Regular';
        margin-block: 50px
    }

    .ant-table-thead > tr > th,
    .ant-table {
        background: transparent;
    }

    .ant-table-thead > tr > th {
        border: none;
    }

    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > thead > tr > th,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > thead > tr > th,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > thead > tr > th,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-summary > table > thead > tr > th,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > tbody > tr > td,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > tbody > tr > td,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tbody > tr > td,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-summary > table > tbody > tr > td,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > tfoot > tr > th,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > tfoot > tr > th,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tfoot > tr > th,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-summary > table > tfoot > tr > th,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > tfoot > tr > td,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > tfoot > tr > td,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tfoot > tr > td,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-summary > table > tfoot > tr > td {
        border: none
    }

    .ant-table.ant-table-bordered > .ant-table-container {
        border: none;
    }

    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table {
        border: none
    }

    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table,
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tbody > tr > td {
    border-bottom: 1px solid var(--user-table-border);
    }

    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table th {
        color: var(--grey-text);
    }
    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table td {
        color: var(--table-black-text);
    }

    .ant-table-tbody > tr > td {
        word-wrap: break-word;
        word-break: break-all;
        min-width: 125px;
    } 

    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tbody > tr > td.more-icon {
        border-left: 1px solid var(--user-table-border);
    }

    .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tbody > tr > td.more-icon .cellnowrap {
        width: fit-content;
    }

    td.ant-table-cell-row-hover {
        background: var(--user-table-cell-hover-bg) !important;
    }


    .ant-table.ant-table-bordered .ant-table-body tr.ant-table-row td:last-of-type {
    }

    td.ant-table-column-sort {
        background-color: transparent;
    }

    .ant-table-column-sorter-inner {
    }

    @media (min-width: 575px) and (max-width: 1025px) {
        .ant-table{
            margin-block: 1em;
        }

        .ant-table-cell.name-column ,
        .ant-table-cell.description-column {
            min-width: 24ch;
        }
        .ant-table-cell.citation-column {
            min-width: 30ch;
        }
    }

`