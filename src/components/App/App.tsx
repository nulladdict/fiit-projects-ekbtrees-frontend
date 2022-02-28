import { Component } from 'react';
import jwt_decode from 'jwt-decode';
import Cookies from 'universal-cookie';
import Main from '../Main';
import Header from '../Header';
import { ICookieAccess, IUser } from '../../common/types';
import { IAppProps, IAppState } from './types';
import RequestService from "../../helpers/requests";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styles from './App.module.css'


const cookies = new Cookies();

class App extends Component<IAppProps & RouteComponentProps, IAppState> {
    constructor(props: IAppProps & RouteComponentProps) {
        super(props);

        this.state = {
            user: null,
            theme: "light",
        }
    }

    componentDidMount() {
        cookies.addChangeListener(this.handleCookie);
        this.handleCookie();
    }

    clearUserAndRedirect = () => {
        this.setState({
            user: null
        });
        this.props.history.push("/");
    }

    removeCookie = () => {
        RequestService.postData('/auth/logout', null).then(() => {
            this.clearUserAndRedirect();
        }).catch(err => {
            console.log("error while logout");
            this.clearUserAndRedirect();
        });
    }

    handleCookie = () => {
        const cookieAccess = cookies.get('AccessToken');

        if (cookieAccess) {
            const decodedCookie: ICookieAccess = jwt_decode(cookieAccess);
            const { id, email, firstName, lastName, roles } = decodedCookie;
            let user: IUser = {
                id: id,
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: roles[0]
            };

            this.setState({
                user: user
            })
        }
    }

    switchTheme = () => {
        this.setState({ theme: this.state.theme === "ligth" ? "dark" : "ligth" });
    }

    render() {
        const { user } = this.state;

        return (
            <>
                <label className={styles.switch}>
                    <input type="checkbox" onClick={this.switchTheme} />
                    <span className={styles.slider}></span>
                </label>
                <Header user={user} onCookieRemove={this.removeCookie} theme={this.state.theme} />
                <Main user={user} onCookie={this.handleCookie} theme={this.state.theme}/>
            </>
        )
    }
}

export default withRouter(App);
