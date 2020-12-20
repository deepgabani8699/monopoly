import React, { Component } from 'react';
import io from './library/io';
import { getState, reduce, getsLoginDataValidFlag } from './store';
import Home from './Home';
import logo from './assets/inventory.gif';
import { Button, Nav, NavLink, Tab, Tabs, Modal, Form, Col, Container, Alert } from 'react-bootstrap';

export function dispatch(action: Action) {
  reduce(action);
  dispatchSideEffects(action);
}

function dispatchSideEffects(action: Action) {
  AppContainer.singleton.setState(getState());

  switch (action.type) {
    case 'addNewDesignFromForm': {
      const { design_no, design_name, colors, design_images } = action;
      io.emit('addNewDesign', { design_no, design_name, colors, design_images });
      return;
    }
    case 'deleteDesignFromForm': {
      const { design_no } = action;
      io.emit('deleteDesign', { design_no });
      return;
    }
    case 'signUpFromForm': {
      const { email_id, password } = action;
      io.emit('signUp', { email_id, password });
      return;
    }
    case 'editDesignFromForm': {
      const { design_no, design_name, colors } = action;
      io.emit('editDesign', { design_no, design_name, colors });
      return;
    }
    default:
      console.log(`Nothing to dispatch from app-container.`);
  }
}

io.on('setState', (state) => {
  const { designs, users } = state;
  dispatch({
    type: 'setStateFromServer', designs, users
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

  logout = () => {
    dispatch({ type: 'logoutFromForm' });
  }

  render() {
    return (
        <Home/>
    );
  }
}
