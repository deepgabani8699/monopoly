import React, {Component} from 'react';
import {Col, Container, Row, Button, Dropdown, DropdownButton, Image, Nav, Navbar, Modal} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import { withRouter } from "react-router";
import logo from './assets/logo.svg';
import './css/header.css'

type HeaderProps = {
};

class Header extends Component<HeaderProps> {
    constructor(props) {
      super(props);
    }

    render() {
        return(
            <header className="primary-header">
              <Navbar>
                <div className="header-tabs">
                  <Navbar.Brand href="/">
                    <img src={logo} className="App-logo" alt="logo" />    {/* Replace logo here */}
                  </Navbar.Brand>
                  <Nav className="header-tabs-tabs">
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/analysis">Analysis</NavLink>
                    <NavLink to="/alerts">Alerts</NavLink>
                  </Nav>
                </div>
              </Navbar>
            </header>
        );
    }
}

export default withRouter(Header);