import React, { Component, Fragment} from 'react';
import styles from './PassRecovery.module.css';
import cn from "classnames";
import {IPassRecoveryProps, IPassRecoveryState} from "./types";


export default class PassRecovery extends Component<IPassRecoveryProps, IPassRecoveryState>{
    render(){
        return(
            <Fragment>
                <h4 className={styles.profileHeading}>Восстановление пароля</h4>
                <form className={styles.recoveryForm}>
                    <h4 className={styles.recoveryHeading}>Забыли пароль?</h4>
                    <p className={styles.recoveryText}>Пожалуйста, введите номер телефона или адрес электронной почты для восстановления пароля.</p>
                    <label className={cn([styles.profileFlex, styles.recovery])}><span>Телефон</span><input type="tel" className={cn([styles.profileInput, styles.recoveryInput])} /></label>
                    <p className={styles.recoveryText}>Или</p>
                    <label className={cn([styles.profileFlex, styles.recovery])}><span>Email</span><input type="email" className={cn([styles.profileInput, styles.recoveryInput])} /></label>
                    <button type="submit" className={cn([styles.profileBtn, styles.recoveryBtn])}>Отправить</button>
                </form>
            </Fragment>
        )
    }
}
