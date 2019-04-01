import React from 'react';
import '../css/Home.css';
import { ListGroup } from 'react-bootstrap';
import ArticleCard from './ArticleCard';
import { BackendAPI } from '../API'

let api = new BackendAPI();
let ArticleData;
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
      let articleList = response;
      console.log(articleList)
      // not sure how to mount the reports to the article card.
      this.setState({
        ...articleList
      })
    })
  }
  render() {

    return (
      <ListGroup variant="flush">
        <ListGroup.Item>
          <ArticleCard {...ArticleData} />
        </ListGroup.Item>

      </ListGroup>
    );
  }
}

interface IArticleListProps {
}

interface IArticleListState {
  articleList: Array<any>;
}
