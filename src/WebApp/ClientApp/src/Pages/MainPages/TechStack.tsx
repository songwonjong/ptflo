import React, { useState } from 'react';
import { BarChart } from '../../components/BarChart/ErrorBarChart';
import myStyle from './About.module.scss'
import ProgressBar from 'react-bootstrap/ProgressBar';
import CSS from 'csstype';
import './Common.css';
import backend from '../../asset/img/newPtflo/backend.png';
import frontend from '../../asset/img/newPtflo/frontend.png';
import version from '../../asset/img/newPtflo/version-control.png';
import sqlIcon from '../../asset/img/newPtflo/sqlIcon.png';

import link from '../../asset/img/newPtflo/black-link.png';

const TechStack: React.FC = () => {



    const gubun = { fontSize: "30pt", fontWeight: "600", color: "#2d3755" };
    const library = { height: "100px", fontSize: "23pt", fontWeight: "600", display: "flex", alignItems: "center", color: "#3f5263" };
    const bar = { width: "80%", height: "25px", fontSize: "15pt", color: "black" };

    const tech = { height: "80px", fontSize: "17pt", display: "flex", alignItems: "center" };
    const techName: CSS.Properties = { width: "30%", paddingRight: "1%", textAlign: "center" };


    return (
        <article className="Skills_Skills" id="skills">
            <div className="Skills_content">
                <div className="SectionTitle_SectionTitle">
                    <div className="SectionTitle_text" style={{ color: "#000000", borderBottomColor: "#cccccc" }}>SKILLS</div>
                    <div className="SectionTitle_link-wrapper">
                        <img className="SectionTitle_link" src={link} alt="" />
                    </div>
                </div>
                <div className="Skills_tech-stacks-container">
                    <div className="Skills_tech-stacks">
                        <div className="Skills_title">Frontend</div>
                        <img className="Skills_img" src={frontend} alt="" />
                    </div>
                    <div className="Skills_tech-stacks">
                        <div className="Skills_title">Backend</div>
                        <img className="Skills_img" src={backend} alt="" />
                    </div>
                    <div className="Skills_tech-stacks">
                        <div className="Skills_title">SQL</div>
                        <img className="Skills_img" src={sqlIcon} alt="" />
                    </div>
                    {/* <div class="Skills_tech-stacks__f20f8">
                        <div class="Skills_title__TH2ju">Mobile App</div>
                        <img class="Skills_img__f94MA" src="/images/skills/mobile-app.png" alt="" />
                    </div> */}
                    {/* <div className="Skills_tech-stacks">
                        <div className="Skills_title">Deployment</div>
                        <img className="Skills_img" src="/images/skills/deployment.png" alt="" />
                    </div> */}
                    <div className="Skills_tech-stacks">
                        <div className="Skills_title">Version Control</div>
                        <img className="Skills_img" src={version} alt="" />
                    </div>
                    {/* <div className="Skills_tech-stacks">
                        <div className="Skills_title">Communication</div>
                        <img className="Skills_img" src="/images/skills/communication.png" alt="" />
                    </div> */}
                    {/* <div className="Skills_tech-stacks">
                        <div className="Skills_title">Certificate</div>
                        <img className="Skills_img" src="/images/skills/certificate.jpg" alt="" />
                    </div> */}
                </div>
            </div>
        </article>
    );
}

export default TechStack;