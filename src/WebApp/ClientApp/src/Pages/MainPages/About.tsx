import React, { useState } from 'react';
import { BarChart } from '../../components/BarChart/ErrorBarChart';
import dotnetLogo from '../../asset/img/techStackIcon/dotnetlogo.png';
import reactLogo from '../../asset/img/techStackIcon/reactLogo.png';
import nodejsLogo from '../../asset/img/techStackIcon/nodejsLogo.png';
import springLogo from '../../asset/img/techStackIcon/springLogo.jpg';
import angularLogo from '../../asset/img/techStackIcon/angularLogo.png';
import postgresqlLogo from '../../asset/img/techStackIcon/postgresqlLogo.png';
import mssqlLogo from '../../asset/img/techStackIcon/mssqlLogo.png';
import myStyle from './About.module.scss'
import ProgressBar from 'react-bootstrap/ProgressBar';
import CSS from 'csstype';
import './Common.css';

const About: React.FC = () => {



    const gubun = { fontSize: "30pt", fontWeight: "600", color: "#2d3755" };
    const library = { height: "100px", fontSize: "23pt", fontWeight: "600", display: "flex", alignItems: "center", color: "#3f5263" };
    const bar = { width: "80%", height: "25px", fontSize: "15pt", color: "black" };

    const tech = { height: "80px", fontSize: "17pt", display: "flex", alignItems: "center" };
    const techName: CSS.Properties = { width: "30%", paddingRight: "1%", textAlign: "center" };

    // const [progress20, setProgress20] = useState({now:0,limit:20})
    // const [progress60, setProgress60] = useState({now:0,limit:60})
    // const [progress80, setProgress80] = useState({now:0,limit:80})
    // const [progress100, setProgress100] = useState({now:0,limit:100})
    const [progress20, setProgress20] = useState(0)
    const [progress40, setProgress40] = useState(0)
    const [progress80, setProgress80] = useState(0)
    const [progress100, setProgress100] = useState(0)

    setTimeout(() => {
        setProgress20(20);
        setProgress40(40);
        setProgress80(80);
        setProgress100(100);
    }, 300);

    // const updateProgress20Handler = setInterval(() => {
    //     if (progress20 >= 20) {
    //         setProgress20(20)
    //         clearInterval(updateProgress20Handler)
    //     }
    //     setProgress20((s: number) => s + 1)
    // }, 50)

    // const updateProgress40Handler = setInterval(() => {
    //     if (progress40 >= 40) {
    //         setProgress40(40)
    //         clearInterval(updateProgress40Handler)
    //     }
    //     setProgress40((s: number) => s + 1)
    // }, 50)

    // const updateProgress80Handler = setInterval(() => {
    //     if (progress80 >= 80) {
    //         setProgress80(80)
    //         clearInterval(updateProgress80Handler)
    //     }
    //     setProgress80((s: number) => s + 1)
    // }, 50)

    // const updateProgress100Handler = setInterval(() => {
    //     if (progress100 >= 100) {
    //         setProgress100(100)
    //         clearInterval(updateProgress100Handler)
    //     }
    //     setProgress100((s: number) => s + 1)
    // }, 50)

    return (
        <section className="page-section about" id="about">
            <div className="container">

                <h2 className="page-section-heading text-center text-uppercase "
                    style={{ color: "#222435 !important" }}>Tech Stack</h2>
                <div className="divider-custom ">
                    {/* <div className="divider-custom-line"></div> */}
                    {/* <div className="col-lg-6"></div> */}
                    {/* <div className="divider-custom-line"></div>
                    <div className="col-lg-2"></div> */}
                    {/* <div className="divider-custom-line"></div> */}
                </div>
                <div className="row divider-custom" style={{ justifyContent: "center" }}>

                    <h3 className="lead " style={gubun}>&nbsp;&nbsp;FRONTEND
                        <div className="divider-custom-line" style={{ maxWidth: "10em" }} />
                    </h3>
                    <div className="col-lg-6 row text-uppercase ">
                        <div className="col-lg-12 text-uppercase "
                            style={library} >
                            {/* <img src={reactLogo} className="img-fluid" style={{ height: "45%", width: "4%" }} /> */}
                            &nbsp;react
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            <span style={techName}>JavaScript</span>
                            <ProgressBar style={bar} variant="danger" now={progress100} />
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            <span style={techName}>TypeScript</span>
                            <ProgressBar style={bar} variant="danger" now={progress100} />
                        </div>
                    </div>
                    <div className="col-lg-6 row text-uppercase ">
                        <div className="col-lg-12 text-uppercase"
                            style={library} >
                            {/* <img src={angularLogo} className="img-fluid" style={{ height: "45%", width: "4%" }} /> */}
                            &nbsp;ANGULAR
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            <span style={techName}>JavaScript</span>
                            <ProgressBar style={bar} variant="bora" now={progress20} />
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            <span style={techName}></span>
                            {/* <ProgressBar style={bar} variant="warning" now={20} /> */}
                        </div>
                    </div>
                    <h3 className="lead " style={gubun}>&nbsp;&nbsp;BACKEND
                        <div className="divider-custom-line" style={{ maxWidth: "10em" }} />
                    </h3>
                    <div className="col-lg-6 row text-uppercase ">
                        <div className="col-lg-12 text-uppercase"
                            style={library} >
                            {/* <img src={nodejsLogo} className="img-fluid" style={{ height: "45%", width: "4%" }} /> */}
                            &nbsp;NODEJS
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            <span style={techName}>TypeScript</span>
                            <ProgressBar style={bar} variant="kaki" now={progress40} />
                        </div>
                    </div>

                    <div className="col-lg-6 row text-uppercase ">
                        <div className="col-lg-12 text-uppercase"
                            style={library} >
                            {/* <img src={dotnetLogo} className="img-fluid" style={{ height: "45%", width: "4%" }} /> */}
                            &nbsp;dotnet
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            <span style={techName}>C#</span>
                            <ProgressBar style={bar} variant="bora" now={progress20} />
                        </div>
                    </div>

                    <div className="col-lg-6 row text-uppercase ">
                        <div className="col-lg-12 text-uppercase"
                            style={library} >
                            {/* <img src={springLogo} className="img-fluid" style={{ height: "45%", width: "4%" }} /> */}
                            &nbsp;spring
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            <span style={techName}>JAVA</span>
                            <ProgressBar style={bar} variant="bora" now={progress20} />
                        </div>
                    </div>
                    <div className="col-lg-6 row text-uppercase ">
                    </div>

                    <h3 className="lead" style={gubun}>&nbsp;&nbsp;SQL
                        <div className="divider-custom-line" style={{ maxWidth: "10em" }} />
                    </h3>
                    <div className="col-lg-6 row text-uppercase ">
                        <div className="col-lg-12 text-uppercase"
                            style={library} >
                            {/* <img src={mssqlLogo} className="img-fluid" style={{ height: "45%", width: "4%" }} /> */}
                            &nbsp;MSSQL
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            {/* <span style={techName}>TypeScript</span> */}
                            <ProgressBar style={bar} variant="norang" now={progress80} />
                        </div>
                    </div>
                    <div className="col-lg-6 row text-uppercase ">
                        <div className="col-lg-12 text-uppercase"
                            style={library} >
                            {/* <img src={postgresqlLogo} className="img-fluid" style={{ height: "45%", width: "4%" }} /> */}
                            &nbsp;POSTGRESQL
                        </div>
                        <div className="col-lg-12 text-uppercase"
                            style={tech} >
                            <ProgressBar style={bar} variant="norang" now={progress80} />
                        </div>
                    </div>
                    {/* variant="success" */}
                    {/* variant="info" */}
                    {/* variant="warning" */}
                    {/* variant="danger" */}

                </div>

                {/* <div className="timeStandard">
                    <div className="graphContainer">
                        <div className="barChart">
                            <BarChart
                                colors={colorsA}
                                data={techStack}
                                dataKeyBar={"TechStack"}
                                dataKeyLine={"Level"}
                                word={"분"}
                                width={"99%"}
                                height={"99%"}
                            />
                        </div>
                    </div>
                </div> */}

            </div>
        </section>
    );
}

export default About;