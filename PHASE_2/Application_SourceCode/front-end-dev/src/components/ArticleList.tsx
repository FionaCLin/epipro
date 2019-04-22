import React from 'react';
import '../css/Basic.css';
import ArticleCard from './ArticleCard';
import { isNullOrUndefined, isNull, isUndefined } from 'util';
import loading from '../imgs/loading1.gif';
import { cleanDate } from './util';
import { IArticleState } from './Article';

export default class ArticleList extends React.Component<IArticleListProps, IArticleListState> {
    constructor(props: IArticleListProps) {
        super(props);
    }

    private showArticleList() {
        if (!isNullOrUndefined(this.props.articleList)) {
            return this.props.articleList.map((articleData: IArticleState) => {
                console.log(articleData);
                articleData.date_of_publication = cleanDate(articleData.date_of_publication);
                return <ArticleCard {...articleData}/>;
            });
        }
    }

    private checkLoading() {
        if (isNull(this.props.articleList)) return <img src={loading} className="loading" alt="loading" />;
    }

    private checkResults() {
        if (!isNullOrUndefined(this.props.articleList) && this.props.articleList.length == 0) {
            return <p>No results found.</p>;
        } else if (isUndefined(this.props.articleList)) {
            return <p></p>;
        }
    }

    private showResultsLength() {
        if (!isNullOrUndefined(this.props.articleList) && this.props.articleList.length != 0) {
            return <p>{this.props.listLength} matching articles found.</p>;
        }
    }

    render() {
        return (

        <div>
            {this.showResultsLength()}
            {this.showArticleList()}
            {this.checkLoading()}
            {this.checkResults()}
            <br />
        </div>
        );
    }
}

interface IArticleListProps {
    articleList: Array<IArticleState> | null | undefined;
    listLength: number;
}

interface IArticleListState {
}
