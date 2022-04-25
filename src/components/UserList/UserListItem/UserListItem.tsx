import React, { Component } from 'react';
import styles from './UserListItem.module.css';
import cn from "classnames";
import {IUserListItemProps, IUserListItemState} from "./types";


export default class UserListItem extends Component<IUserListItemProps, IUserListItemState> {
  render() {
    return (
        <div className={styles.userListItem}>
          <table className={styles.userListItemTable}>
            <tbody>
            <tr><td>Дата</td><td>Пусто</td></tr>
            <tr><td>Имя</td><td>Пусто</td></tr>
            <tr><td>Тел</td><td>Пусто</td></tr>
            <tr><td>Email</td><td>Пусто</td></tr>
            <tr><td>Пароль</td><td>Пусто</td></tr>
            <tr><td>Статус</td><td>Пусто</td></tr>
            <tr><td>Роль</td><td>Пусто</td></tr>
            <tr><td>Актив</td><td><button className={styles.btnBlue} /><i className={cn(["fas", "fa-pencil-alt", styles.fasPencilAlt])} /><button className={styles.btnRed} /></td></tr>
            </tbody>
          </table>
        </div>
    )
  }
}
