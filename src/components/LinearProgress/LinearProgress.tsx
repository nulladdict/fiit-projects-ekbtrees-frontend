import React, {Component} from "react";
import Progress from '@material-ui/core/LinearProgress';
import styles from './LinearProgress.module.css';
import {ILinearProgressProps, ILinearProgressState} from "./types";


export class LinearProgress extends Component<ILinearProgressProps, ILinearProgressState> {
	render () {
		return (
			<div className={styles.wrapper}>
				<Progress />
			</div>
		)
	}
}

export default LinearProgress;
