import React from 'react';
import '../css/Home.css';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default class ArticleCard extends React.Component<IArticleCardProps, IArticleCardState> {
  constructor(props: IArticleCardProps) {
    super(props);
    console.log("HERE");
  }
  
  render() {
    return (
      <div>
        <Link to='/article' className='link'>
          <Card>
            <div className="Card-hover">
            <Card.Body>
              <Card.Title className='Card-title'><h3>{ this.props.headline }</h3></Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                <i>
                  { this.props.url } • { this.props.date_of_publication }
                </i>
              </Card.Subtitle>
              <Card.Text>{ this.props.main_text }</Card.Text>
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
}

interface IArticleCardState {    
}