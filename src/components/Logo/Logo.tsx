import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import styles from './Logo.module.css';
import cn from "classnames";
import logoImage from "../../img/logoHeader.png";


export class Logo extends Component {

	render() {

		return (
			<NavLink exact to='/'>

				<h1 className={styles.logo}>
					<img height="80px" width="120px" src={logoImage} />
					<span className={styles.firstPart}>Ekb</span>
					<span className={styles.secondPart}>Trees</span>
				</h1>


			</NavLink>
		);
	}
}

export default Logo;
