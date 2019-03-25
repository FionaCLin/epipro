import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import TitleSearch from './TitleSearch';
import FilterSearch from './FilterSearch';
import TimeSearch from './TimeSearch';
import ArticleList from './ArticleList';

export default class Search extends React.Component<ISearchProps, ISearchState> {
  constructor(props: ISearchProps) {
    super(props);
    this.state = {
        title: '',
        keyterms: [],
        locations: [],
        startDate: null,
        endDate: null,
        advancedFilter: false
    }
    this.handleChange = this.handleChange.bind(this);
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
                    <FilterSearch type="keyterms" updateFilter={this.handleChange}/>
                    <FilterSearch type="locations" updateFilter={this.handleChange}/>
                    <TimeSearch updateTime={this.handleChange}/>
                    <div className="Filter-button">
                        <Button>Advanced Search</Button>
                    </div>
                </div>
            </Collapse>
            <div className='ArticleList-division' />
            <ArticleList />
        </div>
    );
  }
}

interface ISearchProps {

}

interface ISearchState {
    advancedFilter: boolean;
    title: string;
    keyterms: Array<string>;
    locations: Array<string>;
    startDate: string | null;
    endDate: string | null;
}