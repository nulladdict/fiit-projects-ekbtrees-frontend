import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Menu from '../Menu';
import styles from './SharedHeader.module.css';
import { Logo } from "../Logo/Logo";
import vkLogo from "../../img/vk.png"
import instagramHeaderLogo from "../../img/instagramHeaderLogo.png"
import yotubeHeaderLogo from "../../img/youtubeHeaderLogo.png"


export class SharedHeader extends Component {



	render() {
		return (
			<>
				<div className={styles.sharedHeader}>
					<div>toggle</div>
					<a href='http://facebook.com' target="_blank"><img src={vkLogo} /></a>
					<a href='http://instagram.com' target="_blank"><img src={instagramHeaderLogo} /></a>
					<a href='http://youtube.com' target="_blank"><img src={yotubeHeaderLogo} /></a>
					<select>
						<option value="Русский">Русский</option>
					</select>
				</div>
			</>
		);
	}
}

export default SharedHeader;
