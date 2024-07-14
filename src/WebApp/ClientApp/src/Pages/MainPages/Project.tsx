import React, { useEffect, useState } from 'react';
import { MainPageInfoStore, protflioType } from '../../stores/MainPageStore';
// import suyoungLogo from '../../asset/img/suyoungLogo.png'
import DYGLogo from '../../asset/img/dyglogo.png'
import DeaJoologo from '../../asset/img/DeaJoologo.jpg'
import HyunSeongLogo from '../../asset/img/hslogo.jpg'
// import MESLogo from '../../asset/img/MESLogo.png'
// import Mystyle from './Portfolio.module.scss'
import CSS from 'csstype';
import link from '../../asset/img/newPtflo/black-link.png';
import './Common.css';


interface Props {
    portfolio?: protflioType[];
}
const Project = ({ portfolio }: Props) => {

    // const { portfolio } = MainPageInfoStore;

    // const [portfolioData, setPortfolioData] = useState<protflioType[]>(portfolio);

    // useEffect(() => {
    //     MainPageInfoStore.initStart();
    //     setPortfolioData(portfolio);
    //     console.log(portfolio);
    // }, [portfolio]);

    // suyoungLogo
    // DYGLogo
    // DeaJoologo
    // HyunSeongLogo
    // MESLogo

    const titlefont: CSS.Properties = { width: "10vw", height: "5vh", fontSize: "1.8vw", color: "black", backgroundColor: "white", fontWeight: "bold", textAlign: "center" };



    return (
        <article className="Projects_Projects" id="Projects">
            <div className="Projects_content">
                <div className="SectionTitle_SectionTitle">
                    <div className="SectionTitle_text" style={{ color: "#ffffff", borderBottomColor: "#cccccc" }}>PROJECT</div>
                    <div className="SectionTitle_link-wrapper">
                        <img className="SectionTitle_link" src={link} alt="" />
                    </div>
                </div>
                <div className="Projects_tech-stacks-container">
                    <div className="Projects_tech-stacks">
                        <div style={titlefont}> 수영판지</div>
                        <br />
                        ○ 개발 : 2022.02 ~ 2022.04 (3개월)<br />
                        ○ WEB 개발 및 유지보수 <br />
                        ○ FrontEnd : React(TypeScript)<br />
                        ○ BackEnd : NodeJS(TypeScript)<br />
                        ○ DataBase : PostgreSQL<br />
                        ○ Server OS : CentOS<br />
                    </div>
                    <div className="Projects_tech-stacks">
                        <img style={{ width: "10vw", height: "5vh" }} src={DYGLogo}></img><br />
                        <br />
                        ○ 개발 : 2022.05 ~ 2022.07 (3개월)<br />
                        ○ WEB 개발 및 유지보수<br />
                        ○ FrontEnd : React(TypeScript)<br />
                        ○ BackEnd : NodeJS(TypeScript)<br />
                        ○ DataBase : PostgreSQL<br />
                        ○ Server OS : CentOS<br />
                    </div>
                    <div className="Projects_tech-stacks">
                        <img style={{ width: "10vw", height: "5vh" }} src={DeaJoologo}></img><br />
                        <br />
                        ○ 개발 : 2022.09 ~ 2022.12 (4개월)<br />
                        ○ WEB 개발 및 유지보수<br />
                        ○ FrontEnd : React(TypeScript)<br />
                        ○ BackEnd : DotNet(C#)<br />
                        ○ DataBase : MSSQL<br />
                        ○ Server OS : Windows Server<br />
                    </div>
                    <div className="Projects_tech-stacks">
                        <img style={{ width: "10vw", height: "5vh" }} src={HyunSeongLogo}></img><br />
                        <br />
                        ○ 개발 : 2023.01 ~2023.04 (4개월)<br />
                        ○ WEB 개발 및 유지보수<br />
                        ○ FrontEnd : React(TypeScript)<br />
                        ○ BackEnd : DotNet(C#)<br />
                        ○ DataBase : PostgreSQL<br />
                        ○ Server OS : CentOS<br />
                    </div>
                    <div className="Projects_tech-stacks">
                        <div style={titlefont}>MES</div>
                        {/* <img style={{ height: "80px", width: "200px" }} src={MESLogo}></img><br /> */}
                        <br />
                        ○ 개발:2020.07 ~ 2022.02 <br />(1년 8개월)<br />
                        ○ 유지보수 : 2022.03~ 2023.10 <br />(1년 7개월)<br />
                        ○ WEB 개발 및 유지보수 <br />
                        ○ Mobile 유지보수<br />
                        ○ WEB : - FrontEnd : Angular(JavaScript)<br />
                        &emsp;&emsp;&emsp;&emsp;- BackEnd : Spring(Java)<br />
                        &emsp;&emsp;&emsp;&emsp;- DataBase : PostgreSQL<br />
                        &emsp;&emsp;&emsp;&emsp;- Server OS : CentOS<br />
                        ○ Mobile : AndroidStudio(kotlin)<br />
                    </div>
                    {/* <div className="Projects_tech-stacks">
                        <div className="Projects_title">Deployment</div>
                        <img className="Projects_img" src="/images/Projects/deployment.png" alt="" />
                    </div> */}
                </div>
            </div>
        </article>
    );
}

export default Project;