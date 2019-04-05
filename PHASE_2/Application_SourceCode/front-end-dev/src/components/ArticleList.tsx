import React from 'react';
import '../css/Home.css';
import { ListGroup } from 'react-bootstrap';
import ArticleCard from './ArticleCard';
import { isNullOrUndefined, isNull, isUndefined } from 'util';
import loading from '../imgs/loading1.gif';

export default class ArticleList extends React.Component<IArticleListProps, IArticleListState> {
  constructor(props: IArticleListProps) {
    super(props);
  }

  showArticleList() {
    if (!isNullOrUndefined(this.props.articleList))
    return this.props.articleList.map((articleData: any) => {
      return <ArticleCard {...articleData}/>;
    });
  }

  checkLoading() {
    if (isNull(this.props.articleList)) {
      return <img src={loading} className="loading" alt="loading" />;
    }
  }

  checkResults() {
    if (!isNullOrUndefined(this.props.articleList) && this.props.articleList.length == 0) {
      return <p><br />No results found.</p>;
    } else if (isUndefined(this.props.articleList)) {
      return <p></p>;
    }
  }

  render() {
    return (

    <div>
    <ListGroup variant="flush">
        <ListGroup.Item>
          {this.showArticleList()}
        </ListGroup.Item>
      </ListGroup>
      {this.checkLoading()}
      {this.checkResults()}
    </div>
    );
  }
}

interface IArticleListProps {
  articleList: Array<any> | null | undefined;
}

interface IArticleListState {
}
