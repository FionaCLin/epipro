import React, { Component } from 'react';
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Article from './components/Article';
import Analytics from './components/Analytics';
import Trends from './components/Trends';

export default class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    return (
      <main>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/search" component={Search} />
            <Route path="/article" component={Article} />
            <Route path="/analyze" component={Analytics} />
            <Route path="/trends" component={Trends} />
            <Redirect to="/" />
          </Switch>
        </HashRouter>
      </main>
    );
  }
}

interface IAppProps {

}

interface IAppState {
}
