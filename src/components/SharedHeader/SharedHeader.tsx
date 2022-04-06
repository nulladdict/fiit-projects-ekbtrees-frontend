import React, { Component } from 'react';
import styles from './SharedHeader.module.css';
import { ISharedHeaderProps } from "./types";

export class SharedHeader extends Component<ISharedHeaderProps> {


	render() {
		return (
			<div className={styles.sharedHeader}>
				<label className={styles.switch}>
					<input type="checkbox" onClick={this.props.switchTheme} />
					<span className={styles.slider} />
				</label>
			</div>
		);
	}
}

export default SharedHeader;
