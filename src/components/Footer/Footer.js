import cn from 'classnames';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';
import facebookIcon from '../../img/facebook.png';
import twitterIcon from '../../img/twitter.png';
import instagramIcon from '../../img/instagram.png';
import youtubeIcon from '../../img/youtube.png';
import pinterestIcon from '../../img/pinterest.png';

export default class Footer extends Component {
    render() {
        return (
            <footer className={styles.footerWrapper}>
                <div className={styles.footerMenu}>
                    <NavLink exact to='/map' activeclassname="active">Карта</NavLink>
                    <NavLink exact to='/aboutUs' activeclassname="active">О нас</NavLink>
                    {/* <NavLink exact to='/trees' activeclassname="active">Список деревьев</NavLink> */}
                    <div className={styles.logo}>
                        <h1 className={styles.bigHeader}>Ekb <span className={styles.smallHeader}>Trees</span></h1>
                    </div>
                    {/* <NavLink exact to='/users' activeclassname="active">Список пользователей</NavLink> */}

                    <a href="#!">Контакты</a>
                    <a href="#!">Помощь</a>
                </div>
                <div className={styles.line} />
                <div className={cn([styles.footerMenu, styles.underLine])}>
                    <NavLink exact to='/trees' activeclassname="active">Список деревьев</NavLink>
                    <NavLink exact to='/users' activeclassname="active">Список пользователей</NavLink>
                    {/* <NavLink exact to='/aboutUs' activeclassname="active">О нас</NavLink> */}
                </div>
                <div className={styles.social}>
                    <img src={facebookIcon} alt="facebook" />
                    <img src={twitterIcon} alt="twitter" />
                    <img src={instagramIcon} alt="instagram" />
                    <img src={youtubeIcon} alt="youtube" />
                    <img src={pinterestIcon} alt="pinterest" />
                </div>
                <p className={styles.privacyTerms}>© 2020 — 2021 Privacy-Terms</p>
            </footer>
        )
    }
}
