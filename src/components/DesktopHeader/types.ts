import React from "react";
import {IUser} from "../../common/types";

export interface IDesktopHeaderProps {
    user: IUser | null;
    onCookieRemove?: React.MouseEventHandler<HTMLElement>;
}

export interface IDesktopHeaderState {
    user: IUser | null;
    onCookieRemove?: React.MouseEventHandler<HTMLElement>;
}
