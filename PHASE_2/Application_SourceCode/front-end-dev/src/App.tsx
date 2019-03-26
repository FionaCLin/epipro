import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Article from './components/Article';
import { BackendAPI } from './API'

let api = new BackendAPI();

export default class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    let keyword_locations;
    api.getLocationsByKeyword('Sydney',(error: any, response: any) => {
      if (error) {
        if (error.response) {
          let message = error.response.data.message
          console.log(message, 'ppp');
        } else {
          console.log(error.message, 'ppp');
        }
      }
      keyword_locations = response;
      console.log(keyword_locations, 'sydney locations in app tsx')
    });

    return (
      <main>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/search" component={Search} />
            <Route path="/article" component={Article} />
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
