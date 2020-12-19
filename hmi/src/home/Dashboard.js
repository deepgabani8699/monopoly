import React, {Component} from 'react';
import { withRouter } from "react-router";
import { Button } from 'react-bootstrap';

class Dashboard extends Component {
    render() {
        return (
            <div className="App">
                Hi From Dashboard!            
            </div>
        );
    }
}

export default withRouter(Dashboard);