import React, { Component } from 'react';
import './AboutUs.css';
import {IAboutUsProps, IAboutUsState} from "./types";


export default class AboutUs extends Component<IAboutUsProps, IAboutUsState> {
  renderBlueInfo() {
    return (
      <section className="blue-info">
        <div className="flex-article-part">
          <h2 className='flex-article-part-h2'>Мы самые лучшие!</h2>
          <article className='flex-article'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
				</article>
          <a className="read-more">Читать больше</a>
        </div>
        <div className="flex-image-part">
          <img className="flex-image" src="http://pngimg.com/uploads/men_in_black/men_in_black_PNG20.png"></img>
        </div>
      </section>
    )
  }
  renderWorkInfo() {
    return (
      <section className='work-info'>
        <div className='work-info-1'>
          <div className='green box-info'>
            <i className="fas fa-table"></i>
          </div>
          <h3 className='work-info-h3'>Веб и мобайл дизайн</h3>
          <p className='work-info-p'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </p>
          <a className="read-more">— Читать больше</a>
        </div>
        <div className='work-info-2'>
          <div className='orange box-info'>
            <i className="fas fa-pen-nib"></i>
          </div>
          <h3 className='work-info-h3'>Графический дизайн</h3>
          <p className='work-info-p'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </p>
          <a className="read-more">— Читать больше</a>
        </div>
        <div className='work-info-3'>
          <div className='blue box-info'>
            <i className="fas fa-tablet-alt"></i>
          </div>
          <h3 className='work-info-h3'>Мобильное приложение и веб разработка</h3>
          <p className='work-info-p'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </p>
          <a className="read-more">— Читать больше</a>
        </div>
      </section>
    )
  }
  renderOurTeam() {
    return (
      <div className="contain">
        <h3 className='our-team'>Наша команда</h3>
        <div className="row">
          <div className="row__inner">
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-1.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Разработчик
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-2.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Дизайнер
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-3.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Разработчик
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-1.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Разработчик
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>

            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-2.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Дизайнер
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-3.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Разработчик
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="row__inner">
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-1.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Разработчик
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-2.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Дизайнер
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-3.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Разработчик
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-1.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Разработчик
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>

            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-2.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Дизайнер
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
            <div className="tile">
              <img className="tile__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-3.jpg" alt="" />
              <div className="tile__details">
                <div className="tile__title">
                  Разработчик
                    <p>Кузнецова Алиса</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="about-us">
        <h1 className="about-us-h1">О нас</h1>
        {this.renderBlueInfo()}
        {this.renderWorkInfo()}
        {this.renderOurTeam()}
      </div>
    )
  }
}
