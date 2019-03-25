import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
// import * as API from './API'

declare global {
  interface Window {
    token: any;
  }
}

class App extends Component {
  render() {
    let api_doc_url = window.token
    return (
      <div className="App">
        <div className="bg">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p><strong>EpiPro API</strong></p>
            <p>Predict. Prevent. Protect.</p>
            <a className="a" href={api_doc_url}>
              EpiPro API Documentation
            </a>
          </header>
        </div>
      </div>
    );
  }
}

export default App;
