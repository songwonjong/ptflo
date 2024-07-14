import React from 'react';
import mainImage from '../../asset/img/avataaars1.png';
import mainBackground from '../../asset/img/portfolio/mainBack.jpeg';
import mainBackground1 from '../../asset/img/portfolio/mainBack1.jpg';
import mainBackground2 from '../../asset/img/portfolio/mainBack2.jpg';
import mainBackground3 from '../../asset/img/portfolio/mainback3.jpg';
import './Common.css';


const Masthead = () => {


    return (
        <header className="masthead bg-primary text-white text-center"
            style={{
                backgroundImage: ` linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ),url(${mainBackground3})`, backgroundSize: "cover"
                , backgroundPositionX: "center", paddingTop: "calc(6rem + 200px)", paddingBottom: "8rem"
            }}>
            <div className="container d-flex align-items-center flex-column" >
                {/* <img className="masthead-avatar mb-5" src={mainImage} alt="..." /> */}
                <h1 className="masthead-heading text-uppercase mb-0 lineUp">자기소개서와 포트폴리오를 동시에</h1>
                <div className="divider-custom divider-light">
                    <div className="divider-custom-line"></div>
                    <div className="divider-custom-icon"><i className="fas fa-star"></i></div>
                    <div className="divider-custom-line"></div>
                </div>
                <p className="masthead-subheading font-weight-light mb-0 lineUp">Web - Database - Server</p>
            </div>

        </header>
    );
}

export default Masthead;