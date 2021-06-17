import cn from 'classnames';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import MapContain from '../Map/MapContain';
import styles from './Home.module.css';
import './Map.css';

export default class Home extends Component {
  renderDesktopSection() {
    return (
      <section className={styles.desktop}>
        <div className={styles.flexSearchMap}>
          <div className={styles.search}>
            <div className={cn([styles.green, styles.searchBlock])} />
            <p className={styles.slogan}>Защитим деревья вместе</p>
            <p className={styles.regular2}>
              Нанесите любимые деревья на карту, чтобы документировать их количество и реальное состояние. Объединяйтесь с волонтёрами из вашего района для совместной защиты зелёных насаждений, используя карту, как единый источник информации.
            </p>
          </div>
          <div className={styles.desktopMap}>
            <div className={cn([styles.green, styles.mapBlock])} />
              <div className={styles.mapContainer}>
                <div className={styles.map}>
                  <MapContain user={this.props.user} />
                </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  renderGetStartSection() {
    return (
      <section className={cn([styles.green, styles.getStart, styles.desktop])}>
        <div className={styles.getStartLeft}>
          <p className={cn([styles.regular, styles.bold])}>Готовы начать?</p>
          <p className={cn([styles.regular, styles.inOrReg])}>Войдите или зарегистрируйтесь</p>
        </div>
        <div className={styles.getStartRight}>
          <NavLink className={styles.logInDesktop} exact to='/login' activeclassname="active">Войти</NavLink>
          <NavLink className={styles.signUpDesktop} exact to='/registration' activeclassname="active">Зарегистрироваться</NavLink>
        </div>
      </section>
    )
  }

  renderLastPartSection() {
    return (
      <section className={cn([styles.desktop, styles.lastPart])}>
        <div className={styles.flexContainer}>
          <div className={styles.leftPart}>
            <h3 className={cn([styles.aboutTrees, styles.regular, styles.bold])}>
              Ежегодно Екатеринбург теряет сотни взрослых деревьев. Пора&nbsp;действовать!
            </h3>
            <div className={styles.flexContainer2}>
              <div className={styles.leftPart}>
                <p className={styles.regularSmall}>
                  Городские деревья часто страдают при строительстве. Лишь немногие застройщики осознают ценность уличного озеленения и высаживают крупномеры вдоль фасадов. Большинство же компаний экономит на озеленении, в результате чего качество среды снижается. С помощью этой карты волонтёры смогут требовать сохранения или, как минимум, эквивалентного восстановления зелёной массы уже на стадии общественного обсуждения проекта.
                </p>
              </div>
              <div className={styles.rightPart}>
                <p className={styles.regularSmall}>
                Ежегодно в результате жестокой обрезки и некомпетентого ухода в городе страдают тысячи деревьев. Многие из них долго болеют и умирают. Из-за отсутствия комплексного подхода, никто не занимается их восстановлением. Карта деревьев даст волонтёрам фактологическую основу для контроля нерадивых исполнителей. Ответственные подрядчики, напротив, снизят потери при помощи актуальных данных.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.rightPartImg}>
            <img src="https://i.artfile.ru/1600x1200_601604_[www.ArtFile.ru].jpg" alt="" width="100%" />
          </div>
        </div>
      </section>
    )
  }

  render() {
    return (
      <>
        {this.renderDesktopSection()}
        {this.renderGetStartSection()}
        {this.renderLastPartSection()}
      </>
    )
  }
}
