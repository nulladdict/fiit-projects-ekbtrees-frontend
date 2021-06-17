import AboutUs from '../AboutUs';
import AddNewTreeForm from '../AddNewTreeForm'
import EditTreeForm from '../EditTreeForm';
import ListOfTrees from '../ListOfTrees';
import LoginForm from '../Login-form';
import Home from '../Home';
import ImageView from '../ImageView';
import MapContain from '../Map';
import PassRecovery from '../PassRecovery';
import ProfileSettings from '../ProfileSettings';
import React, { Component } from 'react';
import RegistrationForm from '../Registation-form';
import { Route, Switch } from 'react-router-dom';
import styles from './Main.module.css';
import Tree from "../pages/Tree";
import UserList from '../UserList';

export default class Main extends Component {
  renderRoutesWithAuth () {
      const {user} = this.props;

      return (
            <>
                <Route exact path='/addtree/:lat/:lng' component={AddNewTreeForm} />
                <Route exact path='/trees/tree=:id' component={Tree} />
                <Route exact path='/trees/tree=:id/edit' component={EditTreeForm} />
                <Route exact path='/trees' component={ListOfTrees} />
                <Route exact path='/users' component={UserList} />
                <Route exact path='/profileSettings'
                       render={() => <ProfileSettings user={user} />} />
                <Route exact path='/map' render={() => <MapContain styleName="shrinkMap" user={user} />} />
                <Route exact path='/' render={() => <Home user={user} />} />
            </>
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
          <Route exact path='/map' render={() => <MapContain styleName="shrinkMap" user={null} />} />
          <Route exact path='/' render={() => <Home user={null} />} />
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

  render() {
    return (
      <main className={styles.mainWrapper}>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/passRecovery' component={PassRecovery} />
          <Route exact path='/aboutUs' component={AboutUs} />
          <Route path='/vk' component={() => {
              window.location.href = 'https://ekb-trees-help.ru/auth/oauth2/vk'
          }}/>
          <Route path='/fb' component={() => {
              window.location.href = 'https://ekb-trees-help.ru/auth/oauth2/fb'
          }}/>
            <Route exact path='/image/:id' component={ImageView} />
            {this.renderRoutes()}
        </Switch>
      </main>
    )
  }
}
