import RequestService from "../../helpers/requests";
import {baseUrl} from '../ApiDataLoadHelper/DataLoadHelper'
import {IUserInfo} from "./types";

export const getUser = (userId: string | number): Promise<IUserInfo> => {
    return RequestService.getData(`${baseUrl}user/${userId}`);
}

export const updateUser = (userId: number | string, userInfo: IUserInfo): Promise<boolean> => {
    const headers = {"Content-Type": "application/json; charset=utf8"};
    return RequestService.putData(`${baseUrl}user/${userId}`, JSON.stringify(userInfo), headers);
}

export const updateUserPassword = (newPassword: string): Promise<boolean> => {
    const data = {
        newPassword: newPassword
    };
    const headers = {"Content-Type": "application/json; charset=utf8"};
    return RequestService.putData(`${baseUrl}user/updatePassword`, JSON.stringify(data), headers);
}