import React from 'react';
import logo from '../imgs/logo.png';
import '../css/Home.css';
import { Link } from 'react-router-dom';
import Header from './Header';
import { isNull } from 'util';
import { Form, Button } from 'react-bootstrap';

export default class Home extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props);
        console.log(this.state,'constructor');
        this.state = {
            username: '',
            password: '',
            error: false
        }
    }

    static defaultProps = {
        username: 'admin',
        password: 'EpiProBreak219'
    }

    updateDetails(e: React.ChangeEvent<HTMLSelectElement>, detail: string) {
        let update: any = {};
        update[detail] = e.target.value;
        this.setState(update);
    }

    checkDetails() {
        if (this.state.username == this.props.username && this.state.password == this.props.password) {
            sessionStorage.setItem('login', 'adminLogged');
            window.location.reload();
        } else {
            this.setState({error: true});
        }
    }
  
  render() {
    return (
      <div className="App">
      <Header />
        <body>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>{ !isNull(sessionStorage.getItem('login')) ? 'Welcome to EpiPro' : 'Login to EpiPro' }</h1>
            <h3>Predict. Prevent. Protect.</h3>
            { isNull(sessionStorage.getItem('login')) &&
                <Form>
                    <Form.Control
                        style={{marginBottom: '10px'}}
                        onChange={(e: any) => this.updateDetails(e, 'username')}
                        type="text"
                        value={this.state.username}
                        placeholder="Username" />
                    <Form.Control
                        style={{marginBottom: '10px'}}
                        onChange={(e: any) => this.updateDetails(e, 'password')}
                        type="password"
                        placeholder="Password" />
                    <Button
                        style={{marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '100%'}}
                        onClick={() => this.checkDetails()}
                    >
                        Login
                    </Button>
                    {this.state.error && <p style={{fontSize: 'sm'}}>Incorrect username or password.</p>}
                </Form>
            }
          </header>
        </body>
      </div>
    );
  }
}

interface IHomeProps {
    username: string;
    password: string;
}

interface IHomeState {
    username: string;
    password: string;
    error: boolean;
}
