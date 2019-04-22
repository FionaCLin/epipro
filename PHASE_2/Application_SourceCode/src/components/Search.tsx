import React from 'react';
import '../css/Basic.css';
import { Button, Form } from 'react-bootstrap';
import TimeSearch from './TimeSearch';
import ArticleList from './ArticleList';
import LocationSearch from './LocationSearch';
import KeytermSearch from './KeytermSearch';
import { BackendAPI, IFilterOptions } from '../API';
import { isNull, isNullOrUndefined, isUndefined } from 'util';
import PaginateSearch from './PaginateSearch';
import Header from './Header';
import { createApiFilterState, parseDates } from './util';
import { IArticleState } from './Article';

let api = new BackendAPI();

export default class Search extends React.Component<ISearchProps, ISearchState> {
    constructor(props: ISearchProps) {
        super(props);

        let sessionSearch = sessionStorage.getItem('search');
        if (isNull(sessionSearch)) {
            this.state = {
                title: '',
                keyterms: [],
                locations: [],
                startDate: null,
                endDate: null,
                articleList: undefined,
                currentPage: 1,
                showCount: 10,
                articleCount: 0,
                listLength: 0
            }
        } else {
            let sessionState = JSON.parse(sessionSearch);
            sessionState.startDate = parseDates(sessionState.startDate);
            sessionState.endDate = parseDates(sessionState.endDate);
            this.state = sessionState;
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentWillMount() {
        let sessionSearch = sessionStorage.getItem('search');
        if (isNull(sessionSearch)) this.onSearch();
    }

    private onSearch() {
        let apiFilterState: IFilterOptions = createApiFilterState(this.state);
        
        this.setState({
            articleList: null,
            articleCount: null,
            listLength: 0
        })

        api.getFilteredReports(apiFilterState, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            } else {
                this.setState({
                    articleList: response,
                    articleCount: (!isNullOrUndefined(response)) ? response.length : 0,
                    currentPage: 1,
                    listLength: response.length
                });
                console.log(response.length);
                sessionStorage.setItem('search', JSON.stringify(this.state));
            }
        });
    }

    private handleChange(event: any) {
        this.setState(event);
        console.log(event);
    }

    private paginateArticleList() {
        if (!isNullOrUndefined(this.state.articleList)) {
            let end: number = this.state.currentPage * this.state.showCount;
            let start: number = end - this.state.showCount;
            let sessionSearch = sessionStorage.getItem('search');
            if (!isNull(sessionSearch)) {
                let sessionState = JSON.parse(sessionSearch);
                sessionState.currentPage = this.state.currentPage;
                sessionState.showCount = this.state.showCount;
                sessionStorage.setItem('search', JSON.stringify(sessionState));
            }
            return this.state.articleList.slice(start, end);
        } else {
            return this.state.articleList;
        }
    }

    render() {
        return (
            <div className="bg">
                <Header />
                <body id="top">
                    <div className="Main">
                            <h1>SEARCH</h1>
                            <div id="collapse-filters" className="Filter-panel">
                                <KeytermSearch keyterms={this.state.keyterms} updateKeyterm={this.handleChange}/>
                                <LocationSearch locations={this.state.locations} updateLocation={this.handleChange}/>
                                <TimeSearch startDate={this.state.startDate} endDate={this.state.endDate} updateTime={this.handleChange}/>
                                <Button onClick={this.onSearch}>Search Articles</Button>
                            </div>
                            <Form.Text className="text-muted">
                                * All filters are optional.
                            </Form.Text>
                            <hr />
                            <ArticleList articleList={this.paginateArticleList()} listLength={this.state.listLength}/>
                            <PaginateSearch
                                articleCount={this.state.articleCount}
                                currentPage={this.state.currentPage}
                                showCount={this.state.showCount}
                                updatePaginate={this.handleChange}
                            />
                    </div>
                </body>
            </div>
        );
    }
}

interface ISearchProps {
}

interface ISearchState {
    title: string;
    keyterms: Array<string>;
    locations: Array<string>;
    startDate: Date | null;
    endDate: Date | null;
    articleList: Array<IArticleState> | null | undefined;
    currentPage: number;
    showCount: number;
    articleCount: number | null;
    listLength: number;
}
