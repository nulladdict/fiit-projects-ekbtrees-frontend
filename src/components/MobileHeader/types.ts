import React from "react";
import {IUser} from "../../common/types";


export interface IMobileHeaderProps {
    user: IUser | null;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onCookieRemove?: React.MouseEventHandler<HTMLElement>;
}

export interface IMobileHeaderState {
    open: boolean;
}
