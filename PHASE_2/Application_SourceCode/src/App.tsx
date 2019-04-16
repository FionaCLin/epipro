import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/Home';
import { BackendAPI } from './API'

export default class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    return (
      <main>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Redirect to="/" />
          </Switch>
        </Router>
      </main>
    );
  }
}

interface IAppProps {

}

interface IAppState {
}
