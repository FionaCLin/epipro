import React from 'react';
import '../css/Home.css';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Report from './Report';

export default class ArticleCard extends React.Component<IArticleCardProps, IArticleCardState> {
  constructor(props: IArticleCardProps) {
    super(props);
  }

  trimText(main_text: string) {
    let cutCount: number = main_text.length;
    const minCut: number = 500;

    if (cutCount > minCut) {
      cutCount = minCut;
      while (cutCount < main_text.length && main_text.charAt(cutCount) != ' ') {
        cutCount++;
      }
    }

    return main_text.substring(0, cutCount);
  }
  
  render() {
    return (
      <div>
        <Link to={{
          pathname:'/article',
          state: this.props
        }} className="link">
          <Card>
            <div className="Card-hover">
            <Card.Body>
              <Card.Title className='Card-title'><h3>{ this.props.headline }</h3></Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                <i>
                  { this.props.url } • { this.props.date_of_publication }
                </i>
              </Card.Subtitle>
              <Card.Text>{ this.trimText(this.props.main_text) }...</Card.Text>
              </Card.Body>
              </div>
          </Card>
        </Link>
      </div>
    );
  }
}

interface IArticleCardProps {
  url: string;
  date_of_publication: string;
  headline: string;
  main_text: string;
  reports: Array<Report>;
}

interface IArticleCardState {    
}