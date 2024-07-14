import React, { useEffect, useState } from 'react';
import { MainPageInfoStore, protflioType } from '../../stores/MainPageStore';
// import suyoungLogo from '../../asset/img/suyoungLogo.png'
import DYGLogo from '../../asset/img/dyglogo.png'
import DeaJoologo from '../../asset/img/DeaJoologo.jpg'
import HyunSeongLogo from '../../asset/img/hslogo.jpg'
// import MESLogo from '../../asset/img/MESLogo.png'
import Mystyle from './Portfolio.module.scss'
import CSS from 'csstype';

interface Props {
    portfolio: protflioType[];
}
const Portfolio = ({ portfolio }: Props) => {

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
        <section className="page-section text-white mb-0" id="portfolio" style={{ backgroundColor: "#0b1a2f" }}>
            <div className="container">
                <h2 className="page-section-heading text-center text-uppercase  mb-0" style={{ color: "#EAEAEA" }}>Project</h2>
                <div className="divider-custom">
                    <div className="divider-custom-line" style={{ backgroundColor: "#EAEAEA" }}></div>
                    <div className="divider-custom-icon"><i className="fas fa-star"></i></div>
                    <div className="divider-custom-line" style={{ backgroundColor: "#EAEAEA" }}></div>
                </div>
                <div className="col justify-content-center">
                    <div className="row projectList" style={{ justifyContent: "center" }}>
                        <div className="col-lg-4 mx-auto lineUp" style={{ paddingLeft: "10%" }}>
                            <div style={titlefont}> 수영판지</div>
                            {/* <img style={{ height: "80px", width: "200px" }} src={suyoungLogo}></img><br /> */}
                            <br />
                            ○ 개발 : 2022.02 ~ 2022.04 (3개월)<br />
                            ○ WEB 개발 및 유지보수 <br />
                            ○ FrontEnd : React(TypeScript)<br />
                            ○ BackEnd : NodeJS(TypeScript)<br />
                            ○ DataBase : PostgreSQL<br />
                            ○ Server OS : CentOS<br />
                        </div>
                        <div className="col-lg-4  mx-auto lineUp" style={{ paddingLeft: "10%" }}>
                            {/* <div style={titlefont}>동양정밀</div> */}
                            <img style={{ width: "10vw", height: "5vh" }} src={DYGLogo}></img><br />
                            <br />
                            ○ 개발 : 2022.05 ~ 2022.07 (3개월)<br />
                            ○ WEB 개발 및 유지보수<br />
                            ○ FrontEnd : React(TypeScript)<br />
                            ○ BackEnd : NodeJS(TypeScript)<br />
                            ○ DataBase : PostgreSQL<br />
                            ○ Server OS : CentOS<br />
                        </div>
                        <div className="col-lg-4  mx-auto lineUp" style={{ paddingLeft: "10%" }}>
                            {/* <div style={titlefont}>대주전자</div> */}
                            <img style={{ width: "10vw", height: "5vh" }} src={DeaJoologo}></img><br />
                            <br />
                            ○ 개발 : 2022.09 ~ 2022.12 (4개월)<br />
                            ○ WEB 개발 및 유지보수<br />
                            ○ FrontEnd : React(TypeScript)<br />
                            ○ BackEnd : DotNet(C#)<br />
                            ○ DataBase : MSSQL<br />
                            ○ Server OS : Windows Server<br />
                        </div>
                    </div>
                    <div className="row projectList" style={{ justifyContent: "center", marginTop: "3%" }}>
                        <div className="col-lg-4  mx-auto lineUp" style={{ paddingLeft: "10%" }}>
                            {/* <div style={titlefont}>현성오토텍</div> */}
                            <img style={{ width: "10vw", height: "5vh" }} src={HyunSeongLogo}></img><br />
                            <br />
                            ○ 개발 : 2023.01 ~2023.04 (4개월)<br />
                            ○ WEB 개발 및 유지보수<br />
                            ○ FrontEnd : React(TypeScript)<br />
                            ○ BackEnd : DotNet(C#)<br />
                            ○ DataBase : PostgreSQL<br />
                            ○ Server OS : CentOS<br />
                        </div>
                        <div className="col-lg-4 mx-auto lineUp" style={{ paddingLeft: "10%" }}>
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
                    </div>
                    {/* <div className={Mystyle.projectList}>
                        <span>
                            <img style={{ height: "80px", width: "200px" }} src={suyoungLogo}></img><br />
                            ○ 개발 : 2022.02 ~ 2022.04<br />
                            ○ WEB 개발 및 유지보수 <br />
                            ○ FrontEnd : React(TypeScript)<br />
                            ○ BackEnd : NodeJS(TypeScript)<br />
                            ○ DataBase : PostgreSQL<br />
                            ○ Server OS : CentOS<br />
                        </span>
                        <span>
                            <img style={{ height: "80px", width: "200px" }} src={DYGLogo}></img><br />
                            ○ 개발 : 2022.05 ~ 2022.07<br />
                            ○ WEB 개발 및 유지보수<br />
                            ○ FrontEnd : React(TypeScript)<br />
                            ○ BackEnd : NodeJS(TypeScript)<br />
                            ○ DataBase : PostgreSQL<br />
                            ○ Server OS : CentOS<br />
                        </span>
                        <span>
                            <img style={{ height: "80px", width: "200px" }} src={DeaJoologo}></img><br />
                            ○ 개발 : 2022.09 ~ 2022.10<br />
                            ○ WEB 개발 및 유지보수<br />
                            ○ FrontEnd : React(TypeScript)<br />
                            ○ BackEnd : DotNet(C#)<br />
                            ○ DataBase : MSSQL<br />
                            ○ Server OS : Windows Server<br />
                        </span>
                    </div> */}
                    {/* <div className={Mystyle.projectList}>
                        <span>
                            <img style={{ height: "80px", width: "250px" }} src={HyunSeongLogo}></img><br />
                            ○ 개발 : 2022.12 ~2023.02<br />
                            ○ WEB 개발 및 유지보수<br />
                            ○ FrontEnd : React(TypeScript)<br />
                            ○ BackEnd : DotNet(C#)<br />
                            ○ DataBase : PostgreSQL<br />
                            ○ Server OS : CentOS<br />
                        </span>
                        <span>
                            <img style={{ height: "80px", width: "200px" }} src={MESLogo}></img><br />
                            ○ 개발:2020.07 ~ 2022.02 <br />
                            ○ 유지보수 : 2022.03~ 2023.10 <br />
                            ○ WEB 개발 및 유지보수 <br />
                            ○ Mobile 유지보수<br />
                            ○ WEB : - FrontEnd : Angular(JavaScript)<br />
                            &emsp;&emsp;&emsp;&emsp;- BackEnd : Spring(Java)<br />
                            &emsp;&emsp;&emsp;&emsp;- DataBase : PostgreSQL<br />
                            &emsp;&emsp;&emsp;&emsp;- Server OS : CentOS<br />
                            ○ Mobile : AndroidStudio(kotlin)<br />
                        </span>
                    </div> */}
                    {/* 이것저것을 해서 이것저것 했다 */}
                    {/* {portfolio.length > 0 && portfolio[0].contents} */}
                    {/* Portfolio Items */}

                </div>
            </div>
        </section>
    );
}

export default Portfolio;