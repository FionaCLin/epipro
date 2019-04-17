import React from 'react';
import logo from '../imgs/logo.png';
import '../css/Home.css';
import Header from './Header';

export default class Home extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props);
        console.log(this.state,'constructor');
    }

    static defaultProps = {
        username: 'admin',
        password: 'EpiProBreak219'
    }

  render() {
    return (
      <div className="App">
      <Header />
        <body>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Welcome to EpiPro</h1>
            <h3>Predict. Prevent. Protect.</h3>
          </header>
        </body>
      </div>
    );
  }
}

interface IHomeProps {
}

interface IHomeState {
}
