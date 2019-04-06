import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import TitleSearch from './TitleSearch';
import TimeSearch from './TimeSearch';
import ArticleList from './ArticleList';
import LocationSearch from './LocationSearch';
import KeytermSearch from './KeytermSearch';
import { BackendAPI, IFilterOptions } from '../API';
import { isNull, isNullOrUndefined } from 'util';
import PaginateSearch from './PaginateSearch';

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
                advancedFilter: false,
                articleList: undefined,
                currentPage: 1,
                showCount: 10,
                articleCount: 0
            }
        } else {
            let sessionState = JSON.parse(sessionSearch);
            sessionState.startDate = this.parseDates(sessionState.startDate);
            sessionState.endDate = this.parseDates(sessionState.endDate);
            this.state = sessionState;
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    private parseDates(date: string | null) {
        return (!isNull(date) ? new Date(date) : date);
    }

    private onSearch() {
        let apiFilterState: IFilterOptions = this.createApiFilterState();
        
        this.setState({
            articleList: null,
            articleCount: null
        })

        api.getFilteredReports(apiFilterState, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            }
            this.setState({
                articleList: response,
                articleCount: (!isNullOrUndefined(response)) ? response.length : 0,
                currentPage: 1
            });
            console.log(response.length);
            sessionStorage.setItem('search', JSON.stringify(this.state));
        });
    }

    private createApiFilterState() {
        return ({
            keyterms: this.stringifyKeyterms(),
            locations: this.state.locations.join(','),
            startDate: this.stringifyDates(this.state.startDate),
            endDate: this.stringifyDates(this.state.endDate),
        });
    }

    private stringifyDates(date: Date | null) {
        return (!isNull(date) ? date.toISOString().slice(0, -5) : '');
    }

    private stringifyKeyterms() {
        let keytermString: string = this.state.keyterms.join(',');
        if (this.state.title.length != 0) {
            keytermString += ','  + this.state.title;
        }
        return keytermString;
    }

    private handleChange(event: any) {
        this.setState(event);
        console.log(event);
    }

    private paginateArticleList() {
        if (!isNullOrUndefined(this.state.articleList)) {
            let end: number = this.state.currentPage * this.state.showCount;
            let start: number = end - this.state.showCount;
            return this.state.articleList.slice(start, end);
        } else {
            return this.state.articleList;
        }
    }

    render() {
        return (
            <div className="Main">
                <h1>SEARCH</h1>
                <div>
                    <TitleSearch title={this.state.title} onSearch={this.onSearch} updateTitle={this.handleChange} />
                </div>
                <Button
                    onClick={() => this.handleChange({advancedFilter: !this.state.advancedFilter})}
                    aria-controls="collapse-filters"
                    aria-expanded={this.state.advancedFilter}
                    variant="secondary" size="sm"
                    block
                >
                    Advanced Filters
                </Button>
                <Collapse in={this.state.advancedFilter}>
                    <div id="collapse-filters" className="Filter-panel">
                        <KeytermSearch keyterms={this.state.keyterms} updateKeyterm={this.handleChange}/>
                        <LocationSearch locations={this.state.locations} updateLocation={this.handleChange}/>
                        <TimeSearch startDate={this.state.startDate} endDate={this.state.endDate} updateTime={this.handleChange}/>
                        <div className="Filter-button">
                            <Button onClick={this.onSearch}>Advanced Search</Button>
                        </div>
                    </div>
                </Collapse>
                <div className='ArticleList-division' />
                <ArticleList articleList={this.paginateArticleList()}/>
                <PaginateSearch
                    articleCount={this.state.articleCount}
                    currentPage={this.state.currentPage}
                    showCount={this.state.showCount}
                    updatePaginate={this.handleChange}
                />
            </div>
        );
    }
}
//TODO write Search function fetch backend report data.
interface ISearchProps {

}

interface ISearchState {
    advancedFilter: boolean;
    title: string;
    keyterms: Array<string>;
    locations: Array<string>;
    startDate: Date | null;
    endDate: Date | null;
    articleList: Array<any> | null | undefined;
    currentPage: number;
    showCount: number;
    articleCount: number | null;
}
