import React, { Component } from 'react';
import logo from './logo.gif';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to EpiPro {window.token}</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <div>
          <br></br>
          <a href="https://epiproapp.appspot.com/api/v1/doc/">EpiPro API Documentation</a>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
