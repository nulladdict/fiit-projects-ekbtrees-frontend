import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';
import youtubeIcon from '../../img/youtube.png';
import vkIcon from '../../img/vk.png'
import { IFooterProps, IFooterState } from './types';

export default class Footer extends Component<IFooterProps, IFooterState> {
    render() {
        return (
            <footer className={styles.footerWrapper} data-theme={this.props.theme}>
                <div className={styles.info}>
                    <div className={styles.slogan}><span>Ekb</span><span>Trees</span></div>
                    <span>Copyrights EkbTrees</span>
                    <span className={styles.copyright}>All rights reserved.</span>
                    <div className={styles.images}>
                        <a href={"https://vk.com/parklandekb"}><img className={styles.image} src={vkIcon} alt={"vk"}/></a>
                        <a href={"https://parklandekb.ru"}><img className={styles.image} src={youtubeIcon} alt={"website"}/></a>
                    </div>

                </div>
                <div className={styles.company}>
                    <span>Company</span>
                    <NavLink exact to='/aboutUs' activeClassName="active">About us</NavLink>
                    <NavLink exact to='/aboutUs' activeClassName="active">What we do?</NavLink>
                    <NavLink exact to='/aboutUs' activeClassName="active">News</NavLink>
                    <NavLink exact to='/aboutUs' activeClassName="active">About us</NavLink>

                </div>
                {/*<div className={styles.email}>*/}
                {/*    <span>Stay up to date</span>*/}
                {/*    <input type="text" placeholder="  Your email address" />*/}
                {/*</div>*/}
            </footer >
        )
    }
}
