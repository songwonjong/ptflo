import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavigationBar from '../../components/MenuDropDown/MenuDropDown';
import NavDropdown from 'react-bootstrap/esm/NavDropdown';
import Navbar from 'react-bootstrap/esm/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import myStyle from './Head.module.scss';
import MenuIcon from '../../asset/img/portfolio/MenuBar.png';


const Head = () => {
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleDropdownClose = () => {
        setShowDropdown(false);
    };


    return (
        <>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="" />
                <meta name="author" content="" />
                <title>Freelancer - Start Bootstrap Theme</title>
                <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
                <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossOrigin="anonymous"></script>
                <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
                <link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet" type="text/css" />
                <link href="css/styles.css" rel="stylesheet" />
            </head>
            {/* <Navbar bg="secondary" expand="lg" variant="dark" className="text-uppercase fixed-top" id="mainNav">
                <Navbar.Brand href="#page-top">송원종의 인생</Navbar.Brand>
                <Navbar.Toggle aria-controls="expand">
                    <FontAwesomeIcon icon={faBars} /> 
                </Navbar.Toggle>
                <Navbar.Collapse id="expand">
                    <Nav className="ml-auto">
                        <Nav.Link href="#portfolio">Portfolio</Nav.Link>
                        <Nav.Link href="#about">About</Nav.Link>
                        <Nav.Link href="#contact">Contact</Nav.Link>
                        <NavDropdown title="Dropdown 메뉴" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#dropdown-link1">링크 1</NavDropdown.Item>
                            <NavDropdown.Item href="#dropdown-link2">링크 2</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#dropdown-link3">링크 3</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar> */}
            <nav className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
                <div className="container">
                    <a className="navbar-brand" href="/#page-top">WONJONG SONG</a>
                    {/* <div className="navbar-toggler" data-toggle="collapse" data-target="#expand">
                        <FontAwesomeIcon icon={faBars} /> 
                    </div> */}

                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item mx-0 mx-lg-1"><a className="nav-link py-3 px-0 px-lg-3 rounded" href="/#about-me">ABOUT</a></li>
                            <li className="nav-item mx-0 mx-lg-1"><a className="nav-link py-3 px-0 px-lg-3 rounded" href="/#skills">SKILLS</a></li>
                            <li className="nav-item mx-0 mx-lg-1"><a className="nav-link py-3 px-0 px-lg-3 rounded" href="/#Projects">project</a></li>
                            {/* <li className="nav-item mx-0 mx-lg-1"><a className="nav-link py-3 px-0 px-lg-3 rounded" href="/#contact">Contact</a></li> */}
                            {/* <div>
                                <img className={myStyle.menuIcon} src={MenuIcon} style={{ height: "50px" }} onClick={handleDropdownToggle}></img>
                                {showDropdown ? <div>
                                    <button type="button" className="btn btn-light" onClick={() => navigate('/DetailPortfolio')}>포트폴리오</button>
                                    <button type="button" className="btn btn-light" onClick={() => navigate('/DetailBoard')}>자유</button>
                                </div> : <></>}
                            </div> */}
                            <div style={{ position: 'relative' }}>
                                <img className={myStyle.menuIcon} src={MenuIcon} style={{ height: "50px" }} onClick={handleDropdownToggle} />
                                {showDropdown ? (
                                    <div style={{ position: 'absolute', top: '50px', gap: "10px" }}>
                                        <button type="button" className="btn btn-light" style={{ width: "max-content", fontSize: "15pt", margin: "5px 0px", fontWeight: "bold" }} onClick={() => navigate('/DetailPortfolio')}>포트폴리오</button>
                                        <button type="button" className="btn btn-light" style={{ width: "max-content", fontSize: "15pt", margin: "5px 0px", fontWeight: "bold" }} onClick={() => navigate('/DetailBoard')}>방명록</button>
                                    </div>
                                ) : null}
                            </div>
                        </ul>
                    </div>

                </div>
            </nav>
        </>
    );
}

export default Head;

export const CustomTitle = () => {
    return (
        <span>
            <i className="fas fa-bars"></i>
            <i className="fas fa-bars"></i>
            <i className="fas fa-bars"></i>
        </span>
    );
}
