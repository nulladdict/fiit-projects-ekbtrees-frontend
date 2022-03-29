import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import styles from './Logo.module.css';
import cn from "classnames";
import {ILogoProps, ILogoState} from "./types";


export class Logo extends Component<ILogoProps, ILogoState> {

	render () {
		const logoCN = cn({
			[styles.logo]: true,
			[this.props.className]: Boolean(this.props.className)
		})

		return (
			<NavLink exact to='/' className={logoCN}>
				<h1 className={styles.bigHeader}>Ekb
					<span className={styles.smallHeader}>Trees</span>
				</h1>
			</NavLink>
		);
	}
}

export default Logo;
