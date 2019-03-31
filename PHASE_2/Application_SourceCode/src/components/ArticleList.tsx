import React from 'react';
import '../css/Home.css';
import { ListGroup } from 'react-bootstrap';
import ArticleData from '../dummydata/example-article.json';
import ArticleCard from './ArticleCard';

export default class ArticleList extends React.Component<IArticleListProps, IArticleListState> {
  constructor(props: IArticleListProps) {
    super(props);
  }
  
  render() {
    return (
        <ListGroup variant="flush">
          <ListGroup.Item>
            <ArticleCard {...ArticleData}/>
          </ListGroup.Item>
        </ListGroup>
    );
  }
}

interface IArticleListProps {

}

interface IArticleListState {    
}