import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import styles from './AuthForm.module.css';
import {IAuthFormProps, IAuthFormState} from "./types";


export default class AuthForm extends Component<IAuthFormProps, IAuthFormState> {
    render() {

        return(
            <div className={styles.welcome}>
                <h2 className={styles.title}>Добро пожаловать!</h2>
                <div className={styles.links}>
                    <NavLink className={styles.btnLogin} to='/login' activeClassName={styles.active}>Войти</NavLink>
                    <NavLink className={styles.btnSignUp} to='/registration' activeClassName={styles.active}>Зарегистрироваться</NavLink>
                </div>
            </div>
        )
    }
}
