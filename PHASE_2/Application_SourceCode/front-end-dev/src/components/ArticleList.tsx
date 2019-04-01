import React from 'react';
import '../css/Home.css';
import { ListGroup } from 'react-bootstrap';
import ArticleCard from './ArticleCard';
import ArticleData from '../dummydata/example-article.json'
import { BackendAPI } from '../API'

let api = new BackendAPI();
let articleList: any;
let article: any;
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
      articleList = response as Array<any>;
      article = response[0]
      console.log(typeof ArticleData, ArticleData)
      console.log(typeof articleList, articleList)
      this.setState({
        articleList: articleList
      })
    })
  }
  render() {
    let list: any;
    list = this.state.articleList.map((article: any) => {
      console.log(article)
      return (
        < ListGroup.Item >
          <ArticleCard {...article} />
        </ListGroup.Item >
      )

    })
    return (
      <ListGroup variant="flush">
        {this.state.articleList.map((article: any) => {
          console.log(article)
        })}
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
