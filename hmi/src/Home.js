import React, {Component} from 'react';
import { withRouter } from "react-router";
import { Button, Nav, NavLink } from 'react-bootstrap';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Dashboard from './home/Dashboard';
import Create from './home/Create';
import './css/home.css'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_selected: 'dashboard',
        };
    }

    onTabChange = (tab) => {
        this.setState({ tab_selected: tab })
    }

    render() {
        return (
            <div className="home">
                <div className="home-side-menu">
                    <div className="home-tabs">
                        <Button onClick={this.onTabChange.bind(this, 'dashboard')}> 
                            Dashboard </Button>
                        <Button onClick={this.onTabChange.bind(this, 'create')}> 
                            Create </Button>
                    </div>
                </div>
    
                <div className="home-content">
                    {this.state.tab_selected == 'dashboard' &&  <Dashboard {...this.props} />}
                    {this.state.tab_selected == 'create' &&  <Create {...this.props} />}
                </div>
            </div>
        );
    }
}

export default withRouter(Home);