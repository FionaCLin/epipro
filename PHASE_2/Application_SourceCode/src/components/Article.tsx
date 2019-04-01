import React from 'react';
import '../css/Home.css';
import ArticleData from '../dummydata/example-article.json';
import Report from './Report';
import ReportList from './ReportList';

export default class Article extends React.Component<IArticleProps, IArticleState>{
  constructor(props: IArticleProps) {
    super(props);
  }

  public static defaultProps = {
    url: ArticleData.url,
    date_of_publication: ArticleData.date_of_publication,
    headline: ArticleData.headline,
    main_text: ArticleData.main_text,
    reports: ArticleData.reports
  }
  
  render() {
    return (
        <div className="Main">
          <h1>{this.props.headline}</h1>
          <p><i>URL: <a href={this.props.url}>{this.props.url}</a></i></p>
          <p><i>DOP: {this.props.date_of_publication}</i></p>
          <p>{this.props.main_text}</p>
          <ReportList reports={this.props.reports} />
        </div>
    );
  }
}

interface IArticleProps {
  url: string;
  date_of_publication: string;
  headline: string;
  main_text: string;
  reports: Array<Report>;
}

interface IArticleState {    
}