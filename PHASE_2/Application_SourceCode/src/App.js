import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="bg">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p><strong>EpiPro API</strong></p>
            <p>Predict. Prevent. Protect.</p>
            <a className="a" href="https://epiproapp.appspot.com/api/v1/doc/">
              EpiPro API Documentation
            </a>
          </header>
        </div>
      </div>
    );
  }
}

export default App;
