import cn from 'classnames';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import MapContain from '../Map/MapContain';
import styles from './Home.module.css';
import './Map.css';
import { IHomeProps, IHomeState } from "./types";
import { mapViewPositionContext, setMapViewPositionContext } from "../Main/Main";
import volontary from '../../img/volontary.jpg';
import tree from '../../img/image2_large.jpg';


export default class Home extends Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);

    this.state = { isHideText: true };
  }


  hideText = () => {
    this.setState({ isHideText: !this.state.isHideText });
  }

  renderDesktopSection() {
    return (
      <section className={styles.desktop}>
        <div className={styles.flexSearchMap}>
          <div className={styles.desktopMap}>
            <div className={cn([styles.green, styles.mapBlock])} />
            <div className={styles.mapContainer}>
              <div className={styles.map}>
                <setMapViewPositionContext.Consumer>
                  {setMapViewPosition => (
                    <mapViewPositionContext.Consumer>
                      {mapViewPosition => (
                        <MapContain user={this.props.user} mapViewPosition={mapViewPosition} setMapViewPosition={setMapViewPosition} />
                      )}
                    </mapViewPositionContext.Consumer>
                  )}
                </setMapViewPositionContext.Consumer>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  renderGetStartSection() {
    return (
      <>

        <section style={{ display: "flex" }}>

          <div>
            <h1 className={cn([styles.regular, styles.bold])}>Ежегодно Екатеринбург теряет сотни взрослых деревьев. Защитим их вместе!</h1>
            <h2 className={cn([styles.regular])}>Городские деревья часто страдают при строительстве...
              <a> Читать дальше</a></h2>

          </div>
        </section>
      </>
    )
  }

  renderInvitationSection() {
    return (
      <section className={styles.theme}>
        <img src={volontary} width="700px" height="700px"/>
        <div className={styles.volontary}>
          <h1 className={cn([styles.regular2, styles.bold, styles.volontaryQuestion])} >Как&nbsp;стать&nbsp;волонтером&nbsp;?</h1>
          <p className={styles.regular2}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p className={styles.regular2}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <div style={{ display: "flex", marginTop: "55px" }}>
            <a className={styles.login} href="/login">Войти</a>
            <a className={styles.signup} href="/registration"> Зарегистрироваться</a>
          </div>
        </div>
      </section>
    )
  }

  renderWhatWeDoSection() {
    return (
      <section>
        <h1>&mdash;&mdash;Что мы делаем ?</h1>
        <div style={{ backgroundColor: "#eef0f2" }}>
          <div style={{ margin: "50px", backgroundColor: "black", color: "white", display: "flex" }}>
            <p style={{ padding: "50px" }}>Мы заботимся о деревьях в нашем городе. Городские деревья часто страдают при строительстве. Карта деревьев Екатеринбурга - это инструмент для регистрации городских деревьев...</p>
            <img width="47%" src={tree} style={{ float: "right", overflow: "hidden" }} />

          </div>
        </div>
      </section>
    )
  }

  render() {
    return (
      <>
        {this.renderDesktopSection()}
        {this.props.user ? null : this.renderGetStartSection()}
        {this.renderInvitationSection()}
        {this.renderWhatWeDoSection()}
      </>
    )
  }
}
