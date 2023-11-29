import { useMutation, useQueryClient, useQueries } from "react-query";
import dayjs from "dayjs";
import {
  User,
  UserModalstate,
  ISnackbar,
} from "../types/User";
import { LinkGenerate } from "../types/UserManagement";
import { useState } from "react";
import { copyToClipboard, webUrl } from "../utils/services/helpers";
import { fetchUser, fetchUserRole, postUser, editUser } from "../api/user";

const useUser = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<UserModalstate>({
    visible: false,
    editing: null,
  });
  const [showSnackbar, setShowSnackbar] = useState<ISnackbar>({
    open: false,
    message: "",
    severity: "success"
  });
  // Access the client
  const queryClient = useQueryClient();

  // query
  const [query, { data: userRoles }] = useQueries([
    { queryKey: ["users"], queryFn: fetchUser },
    { queryKey: ["roles"], queryFn: fetchUserRole }
  ]);

  // Mutations
  const { mutate: postUserMutation } = useMutation(postUser, {
    onSuccess: (data: User) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["users"]);
      setConfirmLoading(false);
      setModalState({
        visible: false,
        editing: null,
      });
      setShowSnackbar({
        open: true,
        message: "New user added",
        severity: "success"
      });
      generateLink({ user: data, recovery: false });
    },
    onError: (e: any) => {
      setConfirmLoading(false);
      setShowSnackbar({
        open: true,
        message: e?.response?.data?.error?.message ? e?.response?.data?.error?.message : "Some error occured",
        severity: "error"
      });
    },
  });

  const { mutate: editUserMutation, data: updatedUser } = useMutation(editUser,
    {
      onSuccess: (data: User) => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["users"]);
        setConfirmLoading(false);
        setModalState({
          visible: false,
          editing: null,
        });
        if (!data.recoveryToken) {
            setShowSnackbar({
            open: true,
            message: "User updated",
            severity: "success"
          });
        }
      },
      onError: () => {
        setConfirmLoading(false);
      },
    }
  );

  const handleUser = (user: User | null) => {
    setUserData(user);
  };

  const handleSnackbar = () => {
    setShowSnackbar({
      open: false,
      message: "",
    });
  };

  /**
   * encrypt the user details into base64
   */
  const encryptUser = (str: string) => {
    return window.btoa(encodeURIComponent(str));
  };

  /**
   * Generate link with encrypted userdata
   */
  const generateLink = async (userData: LinkGenerate) => {
    const expDate = dayjs().add(30, "d").toDate();
    const user = JSON.stringify({
      identifier: userData.user.email,
      id: userData.user.id,
      exp: expDate,
    });
    const token = encryptUser(user);
    if(userData.recovery) {
      setShowSnackbar({
        open: true,
        message: "Password recovery link created",
        severity: "success"
      });
    }
    await setUserData(userData.user);
    await editUserMutation({
      user: {recoveryToken: token},
      id: userData.user.id
    });

    handleUser(null);
  };

  /**
   * copy recovery link
   */
  const copyLink = (str: string, recovery:boolean) => {
    const link = `${webUrl}/set-password/${recovery ? false : true}?key=${str}`;
    copyToClipboard(link);
    setShowSnackbar({
      open: true,
      message: `${recovery ? 'Password Recovery' : 'Access'} Link copied`,
      severity: "success"
    });
  };

  return {
    query,
    postUserMutation,
    editUserMutation,
    showModal,
    setShowModal,
    handleUser,
    userData,
    setConfirmLoading,
    confirmLoading,
    updatedUser,
    setModalState,
    modalState,
    handleSnackbar,
    showSnackbar,
    userRoles,
    generateLink,
    copyLink,
  };
};

export default useUser;
