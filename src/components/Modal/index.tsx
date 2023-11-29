import { ChangeEvent, useState, useEffect } from "react";
import styles from "./index.module.css";
import styled from "styled-components";
import { Modal, Spin } from "antd";
import { Role, User, UserModalstate } from "../../types/User";
import {
  AddUserState,
  ModalComponentProps,
} from "../../types/ModalComponent";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import DropdownComponent from "../Dropdown";
import { SelectChangeEvent } from "@mui/material/Select";
import { UseMutateFunction } from "react-query";
import { useFormik } from "formik";
import FormError from "../FormError";
import { validateEmail } from "../../utils/services/helpers";

const StyledModal = styled(Modal)`
  .ant-modal {
    width: 100ch;
  }
  .ant-modal-wrap {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .ant-modal-title {
    font-size: 35px;
    line-height: 1;
  }
  .ant-modal-header,
  .ant-modal-body,
  .ant-modal-footer {
    padding: 0;
  }

  .ant-modal-header {
    border-bottom: none;
    margin-bottom: 1em;
  }

  .ant-modal-content {
    padding: 1.5em 2em;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    width: 49ch;
    margin-inline: auto;
  }

  .ant-modal-close-x {
    display: flex;
    justify-content: start;
    align-items: end;
  }

  .ant-modal-body {
    overflow: auto;
    max-height: 400px;
    padding-block: 1em;
  }
  .ant-form-item {
    margin-bottom: 7.5px;
  }
  .ant-form-item-label {
    padding: 0 0 4px;
  }
  .ant-modal-footer {
    border-top: none;
  }
  .ant-form legend {
    width: inherit;
  }
`;
export interface IUser {
  data: User[] | [];
  postUser: UseMutateFunction;
  editUser: UseMutateFunction;
  isLoading: boolean;
  handleUser: (payload: User | null) => void;
  userData: User | null;
  setConfirmLoading: (e: boolean) => void;
  confirmLoading: boolean;
  updatedUser?: User;
  setModalState: (e: UserModalstate) => void;
  modalState: UserModalstate;
}

const Footer = ({
  modalState,
  handleSubmit,
  handleCancel,
}: {
  modalState: UserModalstate;
  handleSubmit: (e: any) => void;
  handleCancel: () => void;
}) => {
  return (
    <div className={`${styles["modal-footer"]}`}>
      <Button
        colors={["#fff", "var(--table-black-text)", "none"]}
        className={`${styles["plain-whitee-btn"]}`}
        label="Cancel"
        onClick={handleCancel}
      />
      <Button
        label={modalState.editing ? "UPDATE" : "ADD"}
        type="submit"
        onClick={handleSubmit}
      />
    </div>
  );
};
const ModalComponent = ({
  setModalState,
  modalState,
  confirmLoading,
  handleOk,
  handleCancel,
  roles,
  showSnackbar
}: ModalComponentProps & Partial<IUser>) => {
  const roleDataList: any = roles
    ? roles?.roles?.map((x: Role) => {
      x.label = x.name;
      x.value = x.id;
      return x;
    })
    : [];

  const statusDataList = [{ value: 'active', label: 'ACTIVE' }, { value: 'inactive', label: 'INACTIVE' }];

  // const [form] = Form.useForm();
  // const [formErrors, setFormErrors] = useState<AddUserFormErrors>({
  //     firstName: {
  //         show: false,
  //         message: "",
  //     },
  //     lastName: {
  //         show: false,
  //         message: "",
  //     },
  //     email: {
  //         show: false,
  //         message: "",
  //     },
  //     role: {
  //         show: false,
  //         message: "",
  //     },
  // });
  const isEditMode = modalState.editing && modalState.visible

  const [state, setState] = useState<AddUserState>({
    firstName: isEditMode ? modalState.editing?.firstName ?? '' : '',
    lastName: isEditMode ? modalState.editing?.lastName ?? '' : '',
    email: isEditMode ? modalState.editing?.email ?? '' : '',
    role: isEditMode ? modalState.editing?.role : '',
    blocked: '',
  });

  useEffect(() => {

    if (modalState.editing && modalState.visible) {
      setState({
        // ...modalState.editing,
        firstName: modalState.editing.firstName,
        lastName: modalState.editing.lastName,
        email: modalState.editing.email,
        role: modalState.editing.role,
        blocked: modalState.editing.blocked ? 'inactive' : 'active'
      });
      formik.setFieldValue('firstName', modalState.editing.firstName)
      formik.setFieldValue('lastName', modalState.editing.lastName)
      formik.setFieldValue('email', modalState.editing.email)
      formik.setFieldValue('role', modalState.editing.role.id)
    } else {
      setState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        blocked: false
      });
    }
  }, [modalState]);

  const handleSubmit = () => {
    handleOk(state);
    setState({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      blocked: false
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | string[]>,
    name: "firstName" | "lastName" | "email" | "role" | "blocked"
  ) => {
    const lclState: any = state;
    lclState[name] = e.target.value as string;
    setState({ ...lclState });
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
    const lclState: any = state;
    lclState[name] = '';
    setState({ ...lclState });
  };

  const validation = (values: any, formikObject: any) => {
    let errObj = {}
    if (!values.firstName) {
      errObj = {
        ...errObj,
        firstName: 'First Name is required'
      }
    }
    if (!values.lastName) {
      errObj = {
        ...errObj,
        lastName: 'Last Name is required' 
      }
    }
    if (!values.email) {
      errObj = {
        ...errObj,
        email: 'Email is required'
      }
    }
    if (values.email && !validateEmail(values.email)) {
      errObj = {
        ...errObj,
        email: 'Please enter a valid Email'
      }
    }
    if (!values.role) {
      errObj = {
        ...errObj,
        role: 'Role is required' 
      }
    }
    

    if (Object.keys(errObj).length < 1) {
      handleOk(values)
      
    } else {
      formikObject.setErrors(errObj)
    }

  }

  useEffect(() => {
    if(showSnackbar.severity === "success") {
      formik.setFieldValue('firstName', '')
      formik.setFieldValue('lastName', '')
      formik.setFieldValue('email', '')
      formik.setFieldValue('role', '')
    }
  }, [showSnackbar])

  const formik = useFormik({
    initialValues: {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      role: state.role,
    },
    onSubmit: (values, { setErrors }) => {
   
        validation(values, formik)
      
    },
  });

  return (
    <>
      {modalState.visible && (
        <div className={`${styles["container-div"]}`}>
            <StyledModal
              centered
              className={`${styles["container"]}`}
              title={modalState.editing ? "Edit User" : "Add User"}
              open={modalState.visible}
              onCancel={handleCancel}
              confirmLoading={confirmLoading}
              closeIcon={
                <ClearSharpIcon sx={{ width: "1.7em", height: "1.7em" }} />
              }
              footer={[
                <Footer
                  modalState={modalState}
                  handleSubmit={formik.handleSubmit}
                  handleCancel={handleCancel}
                />,
              ]}
            >
          <form onSubmit={formik.handleSubmit}>

              <Spin spinning={confirmLoading}>
                <TextInput
                  className={`${styles["input-field"]} ${styles["firstName"]}`}
                  label="First Name"
                  name="firstName"
                  value={formik.values.firstName}
                  errorField={
                    formik.errors.firstName ?
                      `${formik.errors.firstName}`
                      : ''
                  }
                  onChange={(e) => formik.setFieldValue("firstName", e.target.value)}
                  required
                />
                <TextInput
                  className={`${styles["input-field"]} ${styles["lastName"]}`}
                  label="Last Name"
                  name="lastName"
                  value={formik.values.lastName}
                  errorField={
                    formik.errors.lastName ?
                      `${formik.errors.lastName}`
                      : ''
                  }
                  onChange={(e) => formik.setFieldValue("lastName", e.target.value)}
                  required
                />
                <TextInput
                  className={`${styles["input-field"]} ${styles["email"]}`}
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  errorField={
                    formik.errors.email ?
                      `${formik.errors.email}`
                      : ''
                  }
                  onChange={(e) => formik.setFieldValue("email", e.target.value)}
                  required
                />
                <DropdownComponent
                  className={`WEDR ${styles["role-dropdown"]}`}
                  label={"Role"}
                  name="role"
                  value={formik.values.role}
                  handleChange={(e) => formik.setFieldValue("role", e.target.value)}
                  handleClear={(e) => formik.setFieldValue("role", roleDataList[0].value)}
                  itemsList={roleDataList}
                />
                {
                  formik.errors.role &&
                  <FormError
                    style={{
                      marginTop: '3px'
                    }}
                    msg={"Please select role"}
                  />
                }
                {modalState.editing && <DropdownComponent
                  className={`WEDR ${styles["role-dropdown"]}`}
                  label={"Status"}
                  name="blocked"
                  value={state.blocked}
                  handleChange={(e) => handleChange(e, "blocked")}
                  handleClear={(e) => handleClear(e, 'blocked')}
                  itemsList={statusDataList}
                />}
              </Spin>
              {!modalState.editing && (
                <div className={`${styles["disclaimer"]}`}>
                  Once the new user is added, the access link will be created so
                  it can be shared with the new user.
                </div>
              )}
          </form>
            </StyledModal>
        </div>
      )}
    </>
  );
};

export default ModalComponent;
