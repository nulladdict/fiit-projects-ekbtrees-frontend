import { Component } from 'react';
import styles from './SharedHeader.module.css';
import { ISharedHeaderProps } from "./types";
import vkLogo from "../../img/vk.png"
import instagramHeaderLogo from "../../img/instagramHeaderLogo.png"
import yotubeHeaderLogo from "../../img/youtubeHeaderLogo.png"


export class SharedHeader extends Component<ISharedHeaderProps> {


	render() {
		return (
			<>
				<div className={styles.sharedHeader}>
					<label className={styles.switch}>
						<input type="checkbox" onClick={this.props.switchTheme} />
						<span className={styles.slider}></span>
					</label>
					<a className={styles.links} href='http://facebook.com' target="_blank"><img className={styles.images} src={vkLogo} /></a>
					<a className={styles.links} href='http://instagram.com' target="_blank"><img className={styles.images} src={instagramHeaderLogo} /></a>
					<a className={styles.links} href='http://youtube.com' target="_blank"><img className={styles.images} src={yotubeHeaderLogo} /></a>
					<select className={styles.selectLanguage}>
						<option value="Русский">Русский</option>
					</select>
				</div>
			</>
		);
	}
}

export default SharedHeader;
