import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import TitleSearch from './TitleSearch';
import TimeSearch from './TimeSearch';
import ArticleList from './ArticleList';
import LocationSearch from './LocationSearch';
import KeytermSearch from './KeytermSearch';
import { BackendAPI } from '../API';

let api = new BackendAPI();

export default class Search extends React.Component<ISearchProps, ISearchState> {
    constructor(props: ISearchProps) {
        super(props);
        this.state = {
            title: '',
            keyterms: '',
            locations: '',
            startDate: '',
            endDate: '',
            advancedFilter: false,
            articleList: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch() {
        api.getFilteredReports(this.state, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            }

            console.log(response);

            this.setState({
                articleList: response
            });
        });
    }

    private handleChange(event: any) {
        this.setState(event);
        console.log(event);
    }

    render() {
        return (
            <div className="Main">
                <h1>SEARCH</h1>
                <div>
                    <TitleSearch updateTitle={this.handleChange} />
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
                        <KeytermSearch updateKeyterm={this.handleChange}/>
                        <LocationSearch updateLocation={this.handleChange}/>
                        <TimeSearch updateTime={this.handleChange}/>
                        <div className="Filter-button">
                            <Button onClick={this.onSearch}>Advanced Search</Button>
                        </div>
                    </div>
                </Collapse>
                <div className='ArticleList-division' />
                <ArticleList articleList={this.state.articleList}/>
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
    keyterms: string;
    locations: string;
    startDate: string;
    endDate: string;
    articleList: Array<any> | null;
}
