import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import base64 from 'base-64';
import utf8 from 'utf8';
import styles from './Login-form.module.css';
import AuthForm from '../AuthForm';
import vkIcon from '../../img/vk.png';
import facebookIcon from '../../img/facebook.png';
import { ILogingFormUser } from "../../common/types";
import { ILoginFormProps, ILoginFormState } from "./types";


export default class LoginForm extends Component<ILoginFormProps, ILoginFormState> {
    state: ILoginFormState = {
        touchStart: null,
        logged: true,
        user: {
            email: null,
            password: null,
        },
        error: false
    }

    handleTouch: React.TouchEventHandler<HTMLElement> = (e) => {
        this.setState({
            touchStart: e.changedTouches[0].clientX
        })
    }
    handleTouchEnd: React.TouchEventHandler<HTMLElement> = (e) => {
        // let difference = e.changedTouches[0].clientX - this.state.touchStart;
        let difference = e.changedTouches[0].clientX - (this.state.touchStart ?? 0);
        if (difference < -40) {
            this.pushSingUp()
        }
    }

    pushSingUp() {
        this.props.history.push('/registration');
    }

    handleSubmit:  React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const {user} = this.state;
        // const value = base64.encode(`${utf8.encode(user.email)}:${utf8.encode(user.password)}`);
        // replaced with empty string if null
        const value = base64.encode(`${utf8.encode(user.email ?? "")}:${utf8.encode(user.password ?? "")}`);
        this.fetchToken(value);
    }

    handleChange: (fieldName: keyof ILogingFormUser) => React.ChangeEventHandler<HTMLInputElement> = (fieldName) => (event) => {
        const {user} = this.state;
        // TODO: find out how to add indexing

        user[fieldName] = event.target.value;

        this.setState({user})
    }

    fetchToken (value: string) {
        const {handleCookie} = this.props;

        return fetch('/auth/login', {
            headers: {
                Authorization: value
            },
            method: 'POST',
        })
            .then(async response => {
                if (response.status === 200) {
                    this.setState({error: false}, handleCookie);
                    window.location.href = '/';
                } else {
                    this.setState({error: true});
                }
            })
    }

    renderAuthTitle () {
        return (
            <h2 className={styles.title}>Вход в аккаунт</h2>
        );
    }

    renderErrorMessage () {
        if (this.state.error) {
            return (
                <div className={styles.loginMessage}>
                    <p>Пользователь с данной почтой и паролем не найден.</p>
                </div>
            )
        }

        return null;
    }

    renderButton () {
        return (
            <button type="submit">Войти</button>
        );
    }

    renderSocial () {
        return (
            <div className={styles.flexSocial}>
                <div className={styles.social}>
                    <NavLink to="/vk"><img src={vkIcon} alt="google-link" /></NavLink>
                </div>
                <div className={styles.social}>
                    <NavLink to="/fb"><img src={facebookIcon} alt="facebook-link" /></NavLink>
                </div>
            </div>
        );
    }

    renderFields () {
        return (
            <>
                <input type="text" placeholder="Почта" id="userLogin" onChange={this.handleChange('email')}  required />
                <input type="password" placeholder="Пароль" id="userPassword" onChange={this.handleChange('password')} required />
            </>
        );
    }

    renderLoginHelp () {
        return (
            <>
                {/*<p className={styles.loginHelp}>*/}
                {/*    <NavLink className={styles.restore} exact to='/passRecovery'>Забыли пароль?</NavLink>*/}
                {/*</p>*/}
                <p className={styles.loginMessage}>или войдите с</p>
            </>
        );
    }

    renderRegistrationHelp () {
        return (
            <div className={styles.flexRegister}>
                <p>Нет аккаунта?</p><p className={styles.yellow}> <NavLink to='/registration'>Зарегистрируйтесь сейчас!</NavLink></p>
            </div>
        );
    }

    renderPrivacyTerms () {
        return (
            <p className={styles.privacyTerms}>© 2020 — 2021 Privacy-Terms</p>
        );
    }

    renderAuthForm () {
        return (
            <form onSubmit={this.handleSubmit} className={styles.wrapper}>
                {this.renderAuthTitle()}
                {this.renderFields()}
                {this.renderErrorMessage()}
                {this.renderButton()}
                {this.renderLoginHelp()}
                {this.renderSocial()}
                {this.renderRegistrationHelp()}
                {this.renderPrivacyTerms()}
            </form>
        )
    }

    render() {
        return (
            <div>
                <AuthForm />
                <section className={styles.loginContainer} onTouchStart={this.handleTouch} onTouchEnd={this.handleTouchEnd}>
                    <aside className={styles.loginAside}>
                        <h2 className={styles.title}>С возвращением!</h2>
                        <p>Войдите в аккаунт, чтобы продолжить</p>
                        {/*<NavLink className={styles.linkRegister} exact to='/registration' activeclassname="active">Зарегистрироваться</NavLink>*/}
                        <NavLink className={styles.linkRegister} exact to='/registration' activeClassName="active">Зарегистрироваться</NavLink>
                    </aside>
                    {this.renderAuthForm()}
                </section>
            </div>
        );
    }
}
