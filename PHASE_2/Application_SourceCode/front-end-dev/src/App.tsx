import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Article from './components/Article';
import { BackendAPI } from './API'
import Analytics from './components/Analytics';

export default class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    return (
      <main>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/search" component={Search} />
            <Route path="/article" component={Article} />
            <Route path="/analyze" component={Analytics} />
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
