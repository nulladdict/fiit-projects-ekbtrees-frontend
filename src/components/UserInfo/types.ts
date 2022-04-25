import React from "react";
import {IUser} from "../../common/types";


export interface IUserInfoProps {
    user: IUser | null;
    onCookieRemove?: React.MouseEventHandler<HTMLElement>;
}

export interface IUserInfoState { }
