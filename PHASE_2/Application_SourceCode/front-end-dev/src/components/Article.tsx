import React from 'react';
import '../css/Home.css';
import ArticleData from '../dummydata/example-article.json';
import Report from './Report';
import ReportList from './ReportList';

export default class Article extends React.Component<IArticleProps, IArticleState>{
  constructor(props: IArticleProps) {
    super(props);
  }

  componentWillMount() {
    this.setState(this.props.location.state);
  }
  
  render() {
    console.log(this.state);
    return (
        <div className="Main">
          <h1>{this.state.headline}</h1>
          <p><i>URL: <a href={this.state.url}>{this.state.url}</a></i></p>
          <p><i>DOP: {this.state.date_of_publication}</i></p>
          <p>{this.state.main_text}</p>
          <ReportList reports={this.state.reports} />
        </div>
    );
  }
}

interface IArticleProps {
  location: {state: IArticleState};
}

interface IArticleState {
  url: string;
  date_of_publication: string;
  headline: string;
  main_text: string;
  reports: Array<Report>;   
}