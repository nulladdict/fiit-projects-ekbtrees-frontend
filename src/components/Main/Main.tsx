import AboutUs from '../AboutUs';
import AddNewTreeForm from '../AddNewTreeForm'
import EditTreeForm from '../EditTreeForm';
import TreeLists from '../TreeLists';
import LoginForm from '../Login-form';
import Home from '../Home';
import ImageView from '../ImageView';
import MapContain from '../Map';
import PassRecovery from '../PassRecovery';
import ProfileSettings from '../ProfileSettings';
import React, {Component} from 'react';
import RegistrationForm from '../Registation-form';
import { Route, Switch, Redirect } from 'react-router-dom';
import styles from './Main.module.css';
import Tree from "../pages/Tree";
import UserList from '../UserList';
import {IMainProps, IMainState} from "./types";
import {IMapPosition} from "../../common/types";

export const setMapViewPositionContext = React.createContext<((viewPos: IMapPosition | undefined) => void)>(() => {});
export const mapViewPositionContext = React.createContext<IMapPosition | undefined>(undefined);

export default class Main extends Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);
        this.state = {};
    }
    setMapViewPosition = (viewPos: IMapPosition | undefined) => {
        this.setState({mapViewPosition: viewPos});
    }

  renderRoutesWithAuth () {
      const {user} = this.props;

      return (
          <Switch>
              {/*<Route exact path='/addtree/:lat/:lng' component={AddNewTreeForm} />*/}
              <Route exact path='/addtree/:lat/:lng'
                     render={(props) => <AddNewTreeForm {...props} setMapViewPosition={this.setMapViewPosition}
                                                        user={user}/>}/>
              {/*<Route exact path='/trees/tree=:id/edit' component={EditTreeForm} />*/}
              <Route exact path='/trees/tree=:id/edit' render={(props) => <EditTreeForm {...props} setMapViewPosition={this.setMapViewPosition} user={user}/>}/>
              <Route exact path='/trees' component={TreeLists}/>
              <Route exact path='/users' component={UserList}/>
              <Route exact path='/profileSettings'
                     render={(props) => <ProfileSettings {...props} updateUserByCookies={this.props.onCookie} user={user}/>}/>
              <Redirect to='/'/>
          </Switch>
      );
  }

  renderRoutesWithoutAuth () {
      const {onCookie} = this.props;

      return (
          <>
          <Route
              path='/login'
              render={props => <LoginForm {...props} handleCookie={onCookie}
              />}
          />
          <Route exact path='/registration' component={RegistrationForm} />
          </>
      )
  }

  renderRoutes () {
      const {user} = this.props;

      if (user) {
          return this.renderRoutesWithAuth();
      }

      return this.renderRoutesWithoutAuth();
  }
    // FIXME: What types should these properties have
    vkAuth2: any = () => {
        window.location.href = 'https://ekb-trees-help.ru/auth/oauth2/vk'
    };

  // FIXME: What types should these properties have
    fbAuth2: any = () => {
        window.location.href = 'https://ekb-trees-help.ru/auth/oauth2/fb'
    };

  render () {
      const {user} = this.props;

      return (
          <setMapViewPositionContext.Provider value={this.setMapViewPosition}>
              <mapViewPositionContext.Provider value={this.state.mapViewPosition}>
                  <main className={styles.mainWrapper} data-theme={this.props.theme}>
                      <Switch>
                          <Route exact path='/' render={(props) => <Home {...props} user={user}/>}/>

                          <Route exact path='/map'
                                 render={(props) =>
                                     <MapContain {...props} user={user} mapViewPosition={this.state.mapViewPosition}
                                                 setMapViewPosition={this.setMapViewPosition} className='fullMap'/>}/>
                          <Route exact path='/trees/tree=:id' render={(props) => <Tree {...props} setMapViewPosition={this.setMapViewPosition} user={user}/>}/>
                          <Route exact path='/passRecovery' component={PassRecovery}/>
                          <Route exact path='/aboutUs' component={AboutUs}/>
                          <Route path='/vk' component={this.vkAuth2}/>
                          <Route path='/fb' component={this.fbAuth2}/>
                          <Route exact path='/image/:id' component={ImageView}/>
                          {this.renderRoutes()}
                          <Redirect to='/'/>
                      </Switch>
                  </main>
              </mapViewPositionContext.Provider>
          </setMapViewPositionContext.Provider>
      )
  }
}
