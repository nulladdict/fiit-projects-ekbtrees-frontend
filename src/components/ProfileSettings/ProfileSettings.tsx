import React, {ChangeEvent, Component, Fragment} from 'react';
import styles from './ProfileSettings.module.css';
import cn from "classnames";
import {IProfileSettingsProps, IProfileSettingsState, IUserInfo} from "./types";
import {getUser, updateUser, updateUserPassword} from "./actions";
import Modal from "../Modal";
import modalStyles from "../Modal/Modal.module.css";
import RequestService from "../../helpers/requests";


export default class ProfileSettings extends Component<IProfileSettingsProps, IProfileSettingsState> {
    public aboutUsLayoutAttrs = {cols: "25", rows: "10"};
    public operationInProgress: boolean = false;

    constructor(props: IProfileSettingsProps) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            requiredFields: ['lastName', 'firstName', 'email'],
            userInfo: {
                firstName: "",
                lastName: "",
                email: "",
                phone: ""
            },
            editUserInfo: null,
            newPassword: null,
            modalShow: false,
        }
    }

    componentDidMount() {
        if (this.props.user) {
            getUser(this.props.user.id).then(ui => {
                this.setState({userInfo: ui});
            });
        }
    }

    handleChange = (fieldName: keyof IUserInfo) => (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const {userInfo} = this.state;
        if (!userInfo) {
            return;
        }
        userInfo[fieldName] = event.target.value as any;
        this.setState({userInfo});
    }

    openModelToChangePassword = () => {
        this.setState({modalShow: true});
    }

    handlePasswordChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const newPassword = event.target.value as any;
        this.setState({ newPassword: newPassword });
    }

    updatePassword = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.operationInProgress) return;
        this.operationInProgress = true;
        const {newPassword} = this.state;
        if (newPassword) {
            // console.log("just about to send password!");
            // return;
            updateUserPassword(newPassword).then(succ => {
                // console.log(`updateUserPassword: ${succ}`);
                this.operationInProgress = false;
                this.closeModal();
            }).catch(err => {
                console.log("Error while submitting new password");
            });
        } else {
            // console.log("password is null, won't send");
        }
    }

    renderModalContent(){
        return (
            <form className={styles.profileChangePasswordContainer}  onSubmit={this.updatePassword as React.FormEventHandler<HTMLFormElement>}>
                <p>Введите новый пароль</p>
                <input required name="lastName" value={this.state.newPassword ?? ""}
                       onChange={this.handlePasswordChange} type="password" className={styles.profileInput} />
                <div className={modalStyles.buttonContainer}>
                    <button type={"submit"} className={modalStyles.danger}>Изменить</button>
                    <button className={modalStyles.success} onClick={this.closeModal}>Отмена</button>
                </div>
            </form>
        )
    }

    closeModal = () => {
        this.setState({modalShow: false});
    }


    handleSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        // console.log("handleSubmit: userInfo");
        // console.log(this.state.userInfo);
        if (this.props.user) {
            // console.log("submitting user profile...");
            updateUser(this.props.user.id, this.state.userInfo).then(succ => {
                // console.log(`updated: ${succ}`);
                RequestService.refreshTokenForce().then(succ => {
                    // console.log("refreshed cookies");
                    this.props.updateUserByCookies();
                });
            });
        }
    };

    render() {
        const {user} = this.props;

        return (
            <Fragment>
                <Modal show={this.state.modalShow} onClose={this.closeModal}>
                    {this.renderModalContent()}
                </Modal>
                <h4 className={styles.profileHeading}>Редактирование профиля</h4>
                <form className={styles.profileForm}
                      onSubmit={this.handleSubmit as React.FormEventHandler<HTMLFormElement>}>
                    <label className={cn([styles.profileFlex, styles.flexColumn])}>
                        <span>Фото</span>
                        <input type="file" accept=".png,.jpg" className={styles.profileInput}/>
                    </label>
                    <label className={styles.profileFlex}>
                        <span>Фамилия</span>
                        <input required name="lastName" value={this.state.userInfo.lastName ?? ""}
                               onChange={this.handleChange("lastName")} type="text" className={styles.profileInput}/>
                    </label>
                    <label className={styles.profileFlex}>
                        <span>Имя</span>
                        <input required name="firstName" value={this.state.userInfo.firstName ?? ""}
                               onChange={this.handleChange("firstName")} type="text" className={styles.profileInput}/>
                    </label>
                    <label className={styles.profileFlex}>
                        <span>Отчество</span>
                        <input name="patronymic" type="text" className={styles.profileInput}/>
                    </label>

                    <div className={styles.profileGroup}>
                        <label className={styles.profileFlex}>
                            <span>Телефон</span>
                            <input name="phone" value={this.state.userInfo.phone ?? ""}
                                   onChange={this.handleChange("phone")} type="tel" className={styles.profileInput}/>
                        </label>
                        <label className={styles.profileFlex}>
                            <span>Эл. почта</span>
                            <input required name="email" value={this.state.userInfo.email ?? ""}
                                   onChange={this.handleChange("email")} type="email" className={styles.profileInput}/>
                        </label>
                    </div>
                    <div className={cn([styles.profileGroup, styles.order1])}>
                        <label className={styles.profileFlex}>
                            <span>User id</span>
                            <input name="id" type="text" className={styles.profileInput} defaultValue={user?.id}
                                   disabled/>
                        </label>
                        <label className={styles.profileFlex}>
                            <span>Изменить пароль</span>
                            <button onClick={this.openModelToChangePassword} className={`${styles.profileInput} ${styles.dimOnHover}`}>Ввести новый пароль</button>
                        </label>
                    </div>
                    <div className={styles.profileGroup}>
                        <label className={styles.profileFlex}>
                            <span>Роль</span>
                            <input name="role" type="text" className={styles.profileInput} defaultValue={user?.role}
                                   disabled/>
                        </label>
                        <label className={styles.profileFlex}>
                            <span>Статус</span>
                            <input name="status" type="text" className={styles.profileInput} value="Активен" disabled/>
                        </label>

                    </div>
                    <label className={cn([styles.profileFlex, styles.order2])}>
                        <span>О себе</span>
                        {/*<input name="aboutUs" className={cn([styles.profileInput, styles.textInfo])} cols="25" rows="10" />*/}
                        <input name="aboutUs"
                               className={cn([styles.profileInput, styles.textInfo])} {...this.aboutUsLayoutAttrs} />
                    </label>
                    <div className={cn([styles.profileControls, styles.order3])}>
                        <button type="submit" className={styles.profileBtn}>Подтвердить</button>
                        <button type="button" className={styles.profileBtn}>Отменить</button>
                    </div>
                </form>
            </Fragment>
        )
    }
}
