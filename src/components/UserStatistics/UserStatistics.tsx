import React, {Component} from 'react';
import styles from './UserStatistics.module.css';
import {IUserStatisticsProps, IUserStatisticsState} from "./types";


export default class UserStatistics extends Component<IUserStatisticsProps, IUserStatisticsState>{
    state = {
        treesAdded: 7,
        treesDiffer: 3
    }
    render(){
        return(
                <section className={styles.userStatistics}>
                    <div className={styles.treeStat}>
                        <div className={styles.iconContainer}>
                            <i className="fa fa-tree" aria-hidden="true" />
                        </div>
                        <div className={styles.treesInfo}>
                            <span className={styles.treesSummary}>{this.state.treesAdded}</span>
                            <span className={styles.treesComment}>деревьев добавлено</span>
                        </div>
                    </div>
                    <div className={styles.treeStat}>
                        <div className={styles.iconContainer}>
                            <i className="fa fa-pagelines" aria-hidden="true" />
                        </div>
                        <div className={styles.treesInfo}>
                            <span className={styles.treesSummary}>{this.state.treesDiffer}</span>
                            <span className={styles.treesComment}>добавлено различных деревьев</span>
                        </div>
                    </div>
                </section>
        )
    }
}
