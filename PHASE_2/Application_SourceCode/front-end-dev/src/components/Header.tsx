import React from 'react';
import '../css/Home.css';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import logo from '../imgs/logo.png';
import { Link } from 'react-router-dom';
import { BackendAPI } from '../API';
import { isNull } from 'util';

let api = new BackendAPI();

export default class Header extends React.Component<IHeaderProps, IHeaderState> {
    constructor(props: IHeaderProps) {
        super(props);
        this.state = {
            api_doc_url: ''
        };
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
        return (
            <Navbar className="App-theme" variant="dark" expand="lg">
                <Link to="/">
                    <Navbar.Brand>
                        <img src={logo} className="d-inline-block align-top" height="30" width="30" alt="logo" />
                        {' EpiPro'}
                    </Navbar.Brand>
                </Link>
                <Nav className="mr-auto">
                    <Nav.Link><Link to="/search" className="link">Search</Link></Nav.Link>
                    <Nav.Link><Link to="/analyze" className="link" onClick={() => sessionStorage.removeItem('search')}>Analyze</Link></Nav.Link>
                    <Nav.Link href={this.state.api_doc_url} onClick={() => sessionStorage.removeItem('search')}>API Doc</Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}

interface IHeaderProps {
}

interface IHeaderState {
    api_doc_url: string;
}