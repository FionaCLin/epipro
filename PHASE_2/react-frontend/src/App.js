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
            <p>
              EpiPro API
            </p>
              <p>Predict. Prevent. Protect.</p>
            <a href="https://epiproapp.appspot.com/api/doc/">
              EpiPro API Documentation
            </a>
          </header>
        </div>
      </div>
    );
  }
}

export default App;
