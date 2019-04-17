import React from 'react';
import '../css/Home.css';
import TimeSearch from './TimeSearch';
import LocationSearch from './LocationSearch';
import { Button } from 'react-bootstrap';
import DiseaseSearch from './DiseaseSearch';
import GoogleAPI, { IFilterOptions } from '../Google';
import { isNull } from 'util';
import HeatMap from './Heatmap';
import FrequencyGraph from './FrequencyGraph';
import HistogramGraph from './HistogramGraph';
import MediaCoverage from './MediaCoverage';
import Header from './Header';
import { BackendAPI } from '../API';

let newsAPI = new GoogleAPI();
let backendAPI = new BackendAPI();

export default class Analytics extends React.Component<IAnalyticsProps, IAnalyticsState> {
  constructor(props: IAnalyticsProps) {
    super(props);
    this.state = {
        disease: '',
        locations: [],
        startDate: null,
        endDate: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onAnalyze = this.onAnalyze.bind(this);
  }

  private handleChange(event: any) {
      this.setState(event);
  }

  private onAnalyze() {
    let apiFilterState: IFilterOptions = this.createApiFilterState();
    newsAPI.getFilteredMedia(apiFilterState, (error: any, response: any) => {
        if (error && error.response) {
            let message = error.response.data.message
            console.log('error message', message);
        } else if (error) {
            console.log('error message', error.message);
        }
        console.log(response);
    });
    backendAPI.getAnalytics(apiFilterState, (error: any, response: any) => {
        if (error && error.response) {
            let message = error.response.data.message
            console.log('error message', message);
        } else if (error) {
            console.log('error message', error.message);
        }
        console.log(response);
    });

  }

    private createApiFilterState() {
        let apiFilterState: IFilterOptions = {
            disease: this.state.disease,
            location: this.state.locations[0],
            startDate: this.stringifyDates(this.state.startDate),
            endDate: this.stringifyDates(this.state.endDate),
        };
        console.log(apiFilterState);
        return apiFilterState;
    }

    private stringifyDates(date: Date | null) {
        return (!isNull(date) ? date.toISOString().slice(0, -5) : '');
    }

    render() {
        return (
            <div className="bg">
                <Header />
                <body id="top">
                    <div className="Main">
                    <h1>ANALYZE</h1>
                    <div id="collapse-filters" className="Filter-panel">
                        <DiseaseSearch disease={this.state.disease} updateDisease={this.handleChange}/>
                        <LocationSearch locations={this.state.locations} updateLocation={this.handleChange}/>
                        <TimeSearch startDate={this.state.startDate} endDate={this.state.endDate} updateTime={this.handleChange}/>
                        <div className="Filter-button">
                            <Button onClick={this.onAnalyze}>Create Analytics</Button>
                        </div>
                    </div>
                    <div className='ArticleList-division' />
                        <FrequencyGraph />
                        <HeatMap />
                        <HistogramGraph title='Histogram of events related to Zika'/>
                        <MediaCoverage />
                    </div>
                </body>
            </div>
        );
    }
}

interface IAnalyticsProps {
}

interface IAnalyticsState {
    disease: string;
    locations: Array<string>;
    startDate: Date | null;
    endDate: Date | null;
}