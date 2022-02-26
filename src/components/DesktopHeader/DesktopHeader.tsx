import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import styles from './DesktopHeader.module.css';
import UserInfo from '../UserInfo';
import { Logo } from "../Logo/Logo";
import { IDesktopHeaderProps, IDesktopHeaderState } from "./types";
import Select from '../Select';
import vkLogo from "../../img/vk.png"
import instagramHeaderLogo from "../../img/instagramHeaderLogo.png"
import yotubeHeaderLogo from "../../img/youtubeHeaderLogo.png"


export class DesktopHeader extends Component<IDesktopHeaderProps, IDesktopHeaderState> {
	static defaultProps = {
		onCookieRemove: null,
		user: null
	}

	renderUserLinks() {
		const { user } = this.props;

		if (user) {
			return (
				<NavLink exact to='/trees' activeClassName={styles.activeLink}>Список деревьев</NavLink>
			)
		}
	}

	renderContent() {
		return (
			<div className={styles.desktopHeader}>
				<Logo className={styles.logo} />
				<div className={styles.menu}>
					<NavLink exact to='/map' activeClassName={styles.activeLink}>КАРТА</NavLink>
					<NavLink exact to='/aboutUs' activeClassName={styles.activeLink}>О НАС</NavLink>
					<NavLink exact to='/aboutUs' activeClassName={styles.activeLink}>ИНСТРУКЦИИ</NavLink>
					<NavLink exact to='/aboutUs' activeClassName={styles.activeLink}>КОНТАКТЫ</NavLink>
					{this.renderUserLinks()}
				</div>
				{this.renderUserInfo()}
				{this.renderLoginControllers()}
			</div>
		);
	}

	renderUserInfo() {
		if (this.props.user) {
			return (
				<UserInfo onCookieRemove={this.props.onCookieRemove} user={this.props.user} />
			)
		}
	}

	renderLoginControllers() {
		if (!this.props.user) {
			return (
				<div className={styles.signLinks}>
					<NavLink exact to='/login' activeClassName={styles.activeSignLinks}>Войти</NavLink>
					<NavLink exact to='/registration' activeClassName={styles.activeSignLinks}>Зарегистрироваться</NavLink>
				</div>
			)
		}
	}

	render() {
		return this.renderContent();
	}
}

export default DesktopHeader;
