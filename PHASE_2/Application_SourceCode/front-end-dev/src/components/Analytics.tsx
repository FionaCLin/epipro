import React from 'react';
import '../css/Home.css';
import TimeSearch from './TimeSearch';
import LocationSearch from './LocationSearch';
import { Button } from 'react-bootstrap';
import DiseaseSearch from './DiseaseSearch';
import GoogleAPI, { IFilterOptions } from '../Google';
import { isNull, isNullOrUndefined } from 'util';
import HeatMap from './Heatmap';
import FrequencyGraph from './FrequencyGraph';
import HistogramGraph from './HistogramGraph';
import MediaCoverage from './MediaCoverage';
import Header from './Header';
import TwitterAPI from '../Twitter';
import { BackendAPI, IAnalyticOptions } from '../API';

let newsAPI = new GoogleAPI();
let tweetAPI = new TwitterAPI();
let epiAPI = new BackendAPI();

export default class Analytics extends React.Component<IAnalyticsProps, IAnalyticsState> {
  constructor(props: IAnalyticsProps) {
    super(props);
    this.state = {
        disease: '',
        locations: [],
        startDate: null,
        endDate: null,
        googleArticles: [],
        frequencyData: [],
        googleData: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.onAnalyze = this.onAnalyze.bind(this);
    this.getGoogleData = this.getGoogleData.bind(this);
    this.createDateArray = this.createDateArray.bind(this);
  }

  private handleChange(event: any) {
      console.log(event);
      this.setState(event);
  }

  createDateArray(startDate: string, endDate: string, type: string) {
        let count: Date = new Date(startDate);
        let dateArray: Array<IFrequencyData> = [];
        let countStr =  this.stringifyDates(count, 'startDate').substring(0, startDate.indexOf('T'));
        let endStr: string = endDate.substring(0, endDate.indexOf('T'));
        let temp: IFrequencyData = {date: countStr};

        while (countStr != endStr) {
            temp = { date: countStr };
            temp[type] = 0;
            dateArray.push(temp);
            count.setDate(count.getDate() + 1);
            countStr =  this.stringifyDates(count, 'startDate').substring(0, startDate.indexOf('T'));
        }
        temp = { date: endStr };
        temp[type] = 0;
        dateArray.push(temp);
        console.log('date', dateArray);
        return dateArray;
  }

  getGoogleData() {
    let apiFilterState = undefined;
    if (this.checkWithinMonth()) {
        apiFilterState = this.createApiFilterState(this.state.startDate, this.state.endDate);
    } else {
        console.log("HERE");
        let currentDate = new Date();
        let monthBack = new Date(new Date().setDate(currentDate.getDate() - 30));
        currentDate.setHours(0,0,0,0);
        monthBack.setHours(0,0,0,0);
        console.log(monthBack)
        apiFilterState = this.createApiFilterState(monthBack, currentDate);
    }
    let dateArray = this.createDateArray(apiFilterState.startDate, apiFilterState.endDate, 'Google');
    this.setState({googleArticles: []});
    let count: Date = new Date(apiFilterState.startDate);

    for (let i = 0; i < dateArray.length; i++) {
        let countStart = this.stringifyDates(count, 'startDate');
        let countEnd = this.stringifyDates(count, 'endDate');
        apiFilterState['startDate'] = countStart;
        apiFilterState['endDate'] = countEnd;

        newsAPI.getFilteredMedia(apiFilterState, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            }
            this.setState({googleArticles: this.state.googleArticles.concat(response.articles)});
            dateArray[i].Google = response.totalResults;
            this.setState({googleData: dateArray})
            //console.log('response', response);
        });

        count.setDate(count.getDate() + 1);
        count.setHours(0,0,0,0);
        //console.log('COUNTDATE', count);
    }
  }

  checkWithinMonth() {
    let currentDate = new Date();
    let monthBack = new Date(new Date().setDate(currentDate.getDate() - 30));
    monthBack.setHours(0,0,0,0);
    console.log(monthBack);
    if (new Date(this.stringifyDates(this.state.startDate, 'startDate')) < monthBack) {
        return false;
    } else {
        return true;
    }
  }

  private onAnalyze() {
    let endDate = (!isNull(this.state.endDate)) ? new Date(this.state.endDate) : null;
    let apiFilterState = this.createApiFilterState(this.state.startDate, this.state.endDate);
    this.getGoogleData();
    // tweetAPI.getFilteredMedia(apiFilterState, (error: any, response: any) => {});
    epiAPI.getAnalyticReport(apiFilterState, (error: any, response: any) => {});
    this.setState({endDate: endDate});

  }

    private createApiFilterState(startDate: Date | null, endDate: Date | null) {
        let apiFilterState: IFilterOptions = {
            disease: this.state.disease,
            location: this.state.locations[0],
            startDate: this.stringifyDates(startDate, 'startDate'),
            endDate: this.stringifyDates(endDate, 'endDate'),
        };
        console.log(apiFilterState);
        return apiFilterState;
    }

    private stringifyDates(date: Date | null, dateType: string) {
        if (!isNull(date)) {
            if (dateType == 'endDate') {
                date.setSeconds(date.getSeconds() - 1);
                date.setDate(date.getDate() + 1);
            }
            date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        }
        return (!isNull(date) ? date.toISOString().slice(0, -5) : '');
    }

    render() {
        console.log(this.state.endDate);
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
    googleArticles: Array<any>;
    googleData: Array<IFrequencyData>
    frequencyData: Array<IFrequencyData>;
}

interface IFrequencyData {
    date: string;
    WHO?: number;
    Google?: number;
    Twitter?: number;
    [key: string]: number | string | undefined;
}