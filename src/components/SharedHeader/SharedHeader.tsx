import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Menu from '../Menu';
import styles from './SharedHeader.module.css';
import { Logo } from "../Logo/Logo";
import vkLogo from "../../img/vk.png"
import youtubeHeaderLogo from "../../img/youtube.png"
import russian from "../../img/russian.png"
import { ISharedHeaderProps } from "./types";

export class SharedHeader extends Component<ISharedHeaderProps> {


	render() {
		return (
			<div className={styles.sharedHeader}>
				<label className={styles.switch}>
					<input type="checkbox" onClick={this.props.switchTheme} />
					<span className={styles.slider} />
				</label>
				<a className={styles.links} href='https://youtube.com' target="_blank"><img className={styles.images} src={youtubeHeaderLogo} /></a>
				<img className={styles.russianFlag} src={russian} />
				<select className={styles.select}>
					<option value="Русский">Русский</option>
				</select>
			</div>
		);
	}
}

export default SharedHeader;
