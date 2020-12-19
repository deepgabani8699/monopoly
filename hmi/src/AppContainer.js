import React, {Component} from 'react';
import io from './library/io';
import './css/AppContainer.css';
import { getState, reduce } from './store';
import Home from './Home';
import Analysis from './Analysis';
import Alerts from './Alerts';
import Header from './Header';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import logo from './assets/logo.svg';

export function dispatch(action: Action) {
  reduce(action);
  dispatchSideEffects(action);
}

function dispatchSideEffects(action: Action) {
  AppContainer.singleton.setState(getState());

  switch (action.type) {
    default:
      console.log(`Nothing to dispatch from app-container.`);
  }
}

io.on('setState', (state) => {
  const { designs } = state;
  dispatch({
      type: 'setStateFromServer', designs
  });
});


export default class AppContainer extends Component {
  static singleton: AppContainer;

  constructor() {
      super();
      AppContainer.singleton = this;
      this.state = {
      };
      this.shared_data = getState();
  }

  render() {
    
    if (this.shared_data.serverConnection == 'offline') {
        return (
          <div className="primary-header header-tabs">
            <img src={logo} className="App-logo" alt="logo" />    {/* Replace logo here */}
            <div className="waiting-for-server"> Waiting for server connection... </div>
          </div>
        );
    }

    var redirect = "home";
    return (
      <Router>
          <div>
            <Header/>
            <Switch>
                <Route path="/home" render={(routerProps) => <Home {...routerProps}{...this.shared_data}/>}/>
                <Route path="/analysis" render={(routerProps) => <Analysis {...routerProps}{...this.shared_data}/>}/>
                <Route path="/alerts" render={(routerProps) => <Alerts {...routerProps}{...this.shared_data}/>}/>
                <Redirect from="/" to={redirect}/>
            </Switch>
          </div>
      </Router>
    );
  }
}
