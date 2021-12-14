import React, { Component } from 'react';
import UserInfo from '../UserInfo';
import styles from './UserList.module.css';
import UserListItem from './UserListItem';
import {IUserListProps, IUserListState} from "./types";


export default class UserList extends Component<IUserListProps, IUserListState> {
    render() {
        return (
            <React.Fragment>
                {/*// UserInfo requires attribute "user", used null instead*/}
                {/*// TODO: find out where to get the user*/}
                <UserInfo user={null} />
                <section className={styles.userListSection}>
                    <div className={styles.userListColumn}>
                        <UserListItem />
                        <UserListItem />
                        <UserListItem />
                    </div>
                    <div className={styles.userListColumn}>
                        <UserListItem />
                        <UserListItem />
                        <UserListItem />
                    </div>
                </section>
            </React.Fragment>
        )
    }
}
