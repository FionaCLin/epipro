import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
            <p>My Token = {window.token}</p>
          <a href="https://epiproapp.appspot.com/api/doc/">
            EpiPro API Documentation
          </a>
        </header>
      </div>
    );
  }
}

export default App;
