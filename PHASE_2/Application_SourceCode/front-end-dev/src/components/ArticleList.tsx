import React from 'react';
import '../css/Home.css';
import { ListGroup } from 'react-bootstrap';
import ArticleCard from './ArticleCard';
import { isNullOrUndefined } from 'util';

export default class ArticleList extends React.Component<IArticleListProps, IArticleListState> {
  constructor(props: IArticleListProps) {
    super(props);
  }

  showArticleList() {
    if (!isNullOrUndefined(this.props.articleList))
    return this.props.articleList.map((articleData: any) => {
      return <ArticleCard {...articleData}/>
    });
  }

  render() {
    return (
      <ListGroup variant="flush">
        <ListGroup.Item>
          {this.showArticleList()}
        </ListGroup.Item>

      </ListGroup>
    );
  }
}

interface IArticleListProps {
  articleList: Array<any> | null;
}

interface IArticleListState {
}
