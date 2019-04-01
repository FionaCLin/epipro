import React from 'react';
import '../css/Home.css';
import { ListGroup } from 'react-bootstrap';
import ArticleCard from './ArticleCard';
import ArticleData from '../dummydata/example-article.json'
import { BackendAPI } from '../API'

let api = new BackendAPI();

export default class ArticleList extends React.Component<IArticleListProps, IArticleListState> {
  constructor(props: IArticleListProps) {
    super(props);
    this.state = {
      articleList: []
    }
  }
  componentWillMount() {
    api.getAllReports((error: any, response: any) => {
      if (error && error.response) {
        let message = error.response.data.message
        console.log('error message', message);
      } else if (error) {
        console.log('error message', error.message);
      }
      this.setState({
        articleList: response
      })
    })
  }
  render() {
    let list: any;
    list = this.state.articleList.map((article: any) => {
      return (
        < ListGroup.Item >
          <ArticleCard {...article} />
        </ListGroup.Item >
      )

    })
    return (
      <ListGroup variant="flush">
        {list}
      </ListGroup>
    );
  }
}

interface IArticleListProps {
}

interface IArticleListState {
  articleList: Array<any>;
}
