import React from 'react';
import logo from '../imgs/logo.png';
import '../css/Home.css';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BackendAPI } from '../API'

let api = new BackendAPI();

declare global {
  interface Window {
    token: any;
  }
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);
    this.state={
      api_doc_url: ''
    }
    console.log(this.state,'constructor')
  }

  componentWillMount() {
    let doc_url:string='';
    api.getAPIdocURL((error: any, response: any) => {
      if (error) {
        if (error.response) {
          let message = error.response.data.message
          console.log(message, 'ppp');
        } else {
          console.log(error.message, 'ppp');
        }
        return
      }
      doc_url = response;
      console.log(doc_url, 'doc url in app tsx to set state')
      this.setState({api_doc_url: doc_url})
    });
  }
  
  render() {
    console.log('I am rendering',this.state)
    return (
      <div className="App">
        <div className="bg">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>EpiPro API</p>
            <p>Predict. Prevent. Protect.</p>
            <a href={this.state.api_doc_url}>EpiPro API Documentation</a>
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
  api_doc_url: string;
}
