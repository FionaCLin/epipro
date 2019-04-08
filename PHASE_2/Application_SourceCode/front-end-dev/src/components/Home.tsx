import React from 'react';
import logo from '../imgs/logo.png';
import '../css/Home.css';
import { Link } from 'react-router-dom';
import Header from './Header';

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);
    console.log(this.state,'constructor')
  }
  
  render() {
    return (
      <div className="App">
      <Header />
        <div className="bg">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>EpiPro API</p>
            <p>Predict. Prevent. Protect.</p>
          </header>
        </div>
      </div>
    );
  }
}

interface IHomeProps {
}

interface IHomeState {
}
