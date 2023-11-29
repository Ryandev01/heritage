/* eslint-disable react-hooks/exhaustive-deps */
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Table } from "antd";
import Button from "../../components/Button";
import { ISnackbar, Roles, User, UserModalstate } from "../../types/User";

import styles from "./index.module.css";
import CustomSearchField from "./../SearchField/index";
import type { ColumnsType } from "antd/es/table";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import { useMediaQuery } from 'react-responsive'
import { Menu } from "@mui/material";
import { MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import {
  formatDate,
  itemDeleteAccess,
  passwordGenerator,
} from "../../utils/services/helpers";
import ModalComponent from "../Modal";
import { AddUserState } from "../../types/ModalComponent";
import { LinkGenerate } from "../../types/UserManagement";
import { toggleDeleteUserWindowOpen } from "../../store/reducers/searchResultsReducer";
import { useDispatch } from "react-redux";

const StyledTable = styled(Table)`
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
    font-family: "Roboto-Regular";
    margin-block: 2em;
  }

  .ant-table-thead > tr > th,
  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    border: none;
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > thead
    > tr
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    > thead
    > tr
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    > thead
    > tr
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-summary
    > table
    > thead
    > tr
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > tbody
    > tr
    > td,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    > tbody
    > tr
    > td,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    > tbody
    > tr
    > td,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-summary
    > table
    > tbody
    > tr
    > td,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > tfoot
    > tr
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    > tfoot
    > tr
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    > tfoot
    > tr
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-summary
    > table
    > tfoot
    > tr
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > tfoot
    > tr
    > td,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    > tfoot
    > tr
    > td,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    > tfoot
    > tr
    > td,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-summary
    > table
    > tfoot
    > tr
    > td {
    border: none;
  }

  .ant-table.ant-table-bordered > .ant-table-container {
    border: none;
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table {
    border: none;
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    > tbody
    > tr
    > td {
    border-bottom: 1px solid var(--user-table-border);
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    th {
    color: var(--grey-text);
  }
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    td {
    color: var(--table-black-text);
  }

  .ant-table-tbody > tr > td {
    word-wrap: break-word;
    word-break: break-all;
    min-width: 125px;
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    > tbody
    > tr
    > td.more-icon {
    border-left: 1px solid var(--user-table-border);
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    > tbody
    > tr
    > td.more-icon
    .cellnowrap {
    width: fit-content;
  }

  td.ant-table-cell-row-hover {
    background: var(--user-table-cell-hover-bg) !important;
  }

  .ant-table.ant-table-bordered
    .ant-table-body
    tr.ant-table-row
    td:last-of-type {
  }

  td.ant-table-column-sort {
    background-color: transparent;
  }

  .ant-table-column-sorter-inner {
  }

  .ant-table-cell.more-menu-ant-cell {
      display: flex;
      flex-direction: row;
      align-item: center;
      gap: 10px;
  }

`;
export type IUser = {
  data: User[] | [];
  postUser: any;
  editUser: any;
  isLoading: boolean;
  handleUser: (payload: User | null) => void;
  generateLink: (payload: LinkGenerate) => void;
  userData: User | null;
  setConfirmLoading: (e: boolean) => void;
  confirmLoading: boolean;
  updatedUser?: User;
  showSnackbar: ISnackbar
  setModalState: (e: UserModalstate) => void;
  modalState: UserModalstate;
  userRoles?: Roles;
  copyLink: (str: string, recovery: boolean) => void;
};

export const UserManagementTable = (props: IUser) => {
  const {
    data,
    handleUser,
    editUser,
    postUser,
    userData,
    isLoading: loading,
    setConfirmLoading,
    confirmLoading,
    setModalState,
    modalState,
    userRoles,
    copyLink,
    generateLink,
    showSnackbar
  } = props;
  const [dataList, setDataList] = useState<User[] | []>([]);
  const [search, setSearch] = useState<string>('')
  const dispatch = useDispatch();

  useEffect(() => {
    setDataList(data);
  }, [data]);

  const showModal = (editing: User | null) => {

    setModalState({ visible: true, editing: editing });
    handleUser(editing);
  };

  const handleOk = async (values: AddUserState) => {

    setConfirmLoading(true);
    if (modalState && modalState.editing)
      editUser({
        user: {
          ...userData,
          ...values,
          blocked: values.blocked === "inactive" ? true : false,
        },
        id: modalState.editing.id,
      });
    else {
      const pass = passwordGenerator();
      postUser({
        ...values,
        blocked: true,
        confirmed: false,
        password: pass,
        username: values.email,
      });
    }
  };

  const handleCancel = () => {

    setModalState({ visible: false, editing: null });
  };

  let viewWidths = ["15vw", "15vw", "18vw", "15vw", "15vw", "20vw", "1vw"];

  const tableHeaderJson: ColumnsType<any> = [
    {
      title: "Last Name",
      key: "lastName",
      dataIndex: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      sortDirections: ["ascend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "First Name",
      key: "firstName",
      dataIndex: "firstName",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      width: viewWidths[2],
    },
    {
      title: "Role Assigned",
      dataIndex: "role",
      key: "role",
      render: (value, index) => value.name,
    },
    {
      title: "Last Login",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value, index) => `${formatDate(value)}`,
    },
    {
      title: "Status",
      dataIndex: "blocked",
      render: (value, index) => `${!value ? "ACTIVE" : "INACTIVE"}`,
    },
    {
      title: "",
      key: "action",
      width: "10px",
      className: 'more-menu-ant-cell',
      render: (value, record: User) => (
        <MoreOptionsComponent id={record.id} record={record} />
      ),
    },
  ];

  const MoreOptionsComponent = ({
    record,
    id,
  }: {
    id: number;
    record: User;
  }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const handleClick = (e: any) => {
      setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    // const showRecoveryLink = selectedUserLink?.find((x: LinkGenerate) => x?.user?.id === record.id);
    const showRecoveryLink = record.recoveryToken && (record.recoveryToken !== "null");
    
    return (
      <>
        {showRecoveryLink ? (
          <div className={`${styles["recovery-button"]}`}>
            <Button
              label={`${
                record.confirmed ? "RECOVERY" : "ACCESS"
              } LINK`}
              onClick={() => copyLink(record.recoveryToken, record.confirmed)}
              StartIcon={() => <ContentCopyOutlinedIcon fontSize="small" className={`${styles["copy-icon"]}`}/>}
            />
          </div>
        ) : null}
        <div
          className=""
          onClick={(e) => {
            handleClick(e);
          }}
          style={{
            position: "relative",
            cursor: "pointer",
            textAlign: "right",
            borderLeft: "1px solid var(--user-table-border)",
            width: "fit-content",
            marginLeft: "auto",
          }}
        >
          <MoreHorizIcon />
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            key={1}
            onClick={() => {
              generateLink({ user: record, recovery: true });
              handleClose()
            }}
          >
            Recover Password
          </MenuItem>
          <MenuItem key={2} onClick={() => {
            showModal(record)
            handleClose()
          }}>
            Edit
          </MenuItem>
          {itemDeleteAccess && <MenuItem key={3} onClick={(e) => {
            e.stopPropagation();
            handleClose()
            dispatch(toggleDeleteUserWindowOpen({
              flag: true,
              mailId: record.email ? record.email : 'User'
            }))
          }}>
            Delete
          </MenuItem>}
        </Menu>
      </>
    );
  };

  const filterResults = (value: string) => {

    if (data.length > 0) {
      let newDatalist = [...data];
      /** filter when search string is not empty */
      if (value !== "") {
        newDatalist = dataList
          ? dataList.filter((obj) => {
              let flag = false;

              Object.keys(obj).forEach((key) => {
                if ((key === 'firstName') || (key === 'lastName') || (key === 'email')) {

                  /** if any string out of each column item matches, return result */
                  if (
                    obj[key as keyof User]
                      .toString()
                      .toLowerCase()
                      .indexOf(value.toLowerCase()) !== -1
                  ) {
                    flag = true;
                  }
                }
              });

              return flag;
            })
          : [];
      }
      setDataList(newDatalist);
    }
  };

  return (
    <>
      <ModalComponent
        setModalState={setModalState}
        modalState={modalState}
        handleOk={handleOk}
        handleCancel={handleCancel}
        confirmLoading={confirmLoading}
        roles={userRoles}
        showSnackbar={showSnackbar}
      />
      <div className={`${styles["search-title"]}`}>
        USERS
      </div>
      <div className={`${styles["add-user-btn"]}`}>
        <Button
          label="USER"
          onClick={() => showModal(null)}
          StartIcon={AddIcon}
        />
      </div>

      <div className={`${styles["custom-search"]}`}>
        <CustomSearchField
          className={`${styles["custom-search-field"]}`}
          shouldHandleChangeFromParent={true}
          valueFromParent={search}
          handleChangeParent={(e) => {
            setSearch(e.target.value);
            filterResults(e.target.value);
          }}
          handleClearSearchText={() => {
            setSearch('');
            filterResults('');
          }}
        />
      </div>
      <StyledTable
        className={`${styles["table-container"]}`}
        rowKey={"id"}
        size="small"
        columns={tableHeaderJson}
        dataSource={dataList}
        pagination={false}
        loading={loading ? loading : false}
        bordered
        scroll={{ x: true, y: 300 }}
        style={{
          background: "transparent",
        }}
      ></StyledTable>
    </>
  );
};
