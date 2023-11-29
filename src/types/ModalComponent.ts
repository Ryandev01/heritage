import { IUser } from './../components/Modal/index';
import { UserModalstate, Roles, ISnackbar } from './User';

export type ModalComponentProps = {

    setModalState: (e: UserModalstate) => void
    modalState: UserModalstate
    handleOk: (values: AddUserState) => void
    handleCancel: () => void
    roles?: Roles
    showSnackbar: ISnackbar
} & Partial<IUser>

export type AddUserState = {
    firstName: string
    lastName: string
    email: string
    role: any
    blocked: any
}

type AddUserFormError = {
    show: boolean;
    message: string;
};

export type AddUserFormErrors = {
    firstName: AddUserFormError;
    lastName: AddUserFormError;
    email: AddUserFormError;
    role: AddUserFormError;
    status: AddUserFormError;
};