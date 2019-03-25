import React from 'react';
import logo from '../imgs/logo.png';
import '../css/Home.css';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    token: any;
  }
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);
  }
  
  render() {
    return (
        <div className="App">
            <div className="bg">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>EpiPro API</p>
                <p>Predict. Prevent. Protect.</p>
                <a href="https://epiproapp.appspot.com/api/doc/">EpiPro API Documentation</a>
                <Link to='/search'>Search</Link>
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