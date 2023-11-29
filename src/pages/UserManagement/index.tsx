import { Container } from "@mui/material";
import Header from "../../components/Header";
import UserMenuComponent from "../../components/UserMenu/index";
import styles from "./index.module.css";
import Snackbar from "../../components/Snackbar";
import { UserManagementTable } from "../../components/UserManagementTable";
import useUser from "../../hooks/useUser";

const UserManagement = () => {
  const {
    query,
    handleUser,
    userData,
    editUserMutation,
    postUserMutation,
    setConfirmLoading,
    confirmLoading,
    updatedUser,
    setModalState,
    modalState,
    handleSnackbar,
    showSnackbar,
    userRoles,
    copyLink,
    generateLink,
  } = useUser();
  
  const { data, isLoading } = query;

  return (
    <>
      <div>
        <Header/>
        <UserMenuComponent />
        <div className={`${styles["content-section"]}`}>
          <Container maxWidth="xl">
            <UserManagementTable
              isLoading={isLoading}
              data={data || []}
              handleUser={handleUser}
              editUser={editUserMutation}
              postUser={postUserMutation}
              showSnackbar={showSnackbar}
              userData={userData}
              setConfirmLoading={setConfirmLoading}
              confirmLoading={confirmLoading}
              updatedUser={updatedUser}
              setModalState={setModalState}
              modalState={modalState}
              userRoles={userRoles}
              copyLink={copyLink}
              generateLink={generateLink}
            />
          </Container>
          <Snackbar
            message={showSnackbar.message}
            open={showSnackbar.open}
            handleClose={handleSnackbar}
            severity={showSnackbar.severity ? showSnackbar.severity : "error"}
            duration={5000}
          />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
