import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './UserMenu.module.css';
import cn from "classnames";
import {IUserMenuProps, IUserMenuState} from "./types";


export default class UserMenu extends Component<IUserMenuProps, IUserMenuState> {
    render() {
        return (
            <div className={styles.userNavBar}>
                <NavLink exact to='/trees' activeClassName={styles.active}><i className={cn([styles.faUser, "fas", "fa-user"])} />Мои деревья</NavLink>
                <NavLink exact to='/profileSettings'  activeClassName={styles.active}><i className={cn([styles.faUser, "fas", "fa-user"])} />Настройки</NavLink>
            </div>
        )
    }
}
