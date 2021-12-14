import {ITreeProperty, IUser} from "../../common/types";

export interface IUserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

// Maybe it would be better to use TextField instead of inputs
export interface IEditUserInfo {
    firstName: ITreeProperty;
    lastName: ITreeProperty;
    email: ITreeProperty;
    phone: ITreeProperty;
}

export interface IProfileSettingsProps {
    user: IUser | null;
}

export interface IProfileSettingsState {
    requiredFields: (keyof IUserInfo)[];
    userInfo: IUserInfo;
    editUserInfo: IEditUserInfo | null;
}
