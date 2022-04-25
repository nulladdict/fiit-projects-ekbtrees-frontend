import React from "react";
import {IUser} from "../../common/types";


export interface IMenuLink {
    activeClassName: string;
    exact: boolean;
    onClick?: React.MouseEventHandler<HTMLElement>;
    title: string;
    to: string;
    className: string;
    hidden?: boolean;
}

export interface IMenuProps {
    user: IUser | null;
    onClick: React.MouseEventHandler<HTMLElement>;
    onCookieRemove?: React.MouseEventHandler<HTMLElement>;
}

export interface IMenuState { }
