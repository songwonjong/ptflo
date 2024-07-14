import React, { useState } from 'react';
import { NavDropdown, Navbar } from 'react-bootstrap';
import MenuIcon from './MenuIcon.png';

const MenuDropdown = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleDropdownClose = () => {
        setShowDropdown(false);
    };

    return (
        <>
            <Navbar.Toggle
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded={showDropdown}
                onClick={handleDropdownToggle}
            >
                <span className="navbar-toggler-icon" ></span> {/* 햄버거 아이콘 */}
            </Navbar.Toggle>
            <NavDropdown
                title=""
                id="basic-nav-dropdown"
                show={showDropdown}
                onSelect={handleDropdownClose}
            >
                <NavDropdown.Item href="#action1">메뉴 항목 1</NavDropdown.Item>
                <NavDropdown.Item href="#action2">메뉴 항목 2</NavDropdown.Item>
                <NavDropdown.Item href="#action3">메뉴 항목 3</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action4">분리된 메뉴 항목</NavDropdown.Item>
            </NavDropdown>
        </>
    );
};

const NavigationBar: React.FC = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Collapse id="navbarNav">
                <MenuDropdown />
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
