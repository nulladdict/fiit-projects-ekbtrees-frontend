import React, { Component } from 'react';
import DesktopHeader from "../DesktopHeader/DesktopHeader";
import MobileHeader from '../MobileHeader/MobileHeader';
import styles from './Header.module.css';
import {IHeaderProps, IHeaderState} from "./types";


export default class Header extends Component<IHeaderProps, IHeaderState> {
    render() {
        const {onCookieRemove} = this.props;

        return (
            <header className={styles.headerWrapper} data-theme={this.props.theme}>
                <MobileHeader onCookieRemove={onCookieRemove} user = {this.props.user}/>
                <DesktopHeader onCookieRemove={onCookieRemove} user={this.props.user}/>
            </header>
        )
    }
}
