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
declare var trends: any;

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

  next_fun(){
        console.log("LINE 47");
        var divElem = document.getElementById('sampDiv');
        if (!isNull(divElem)) divElem.innerHTML = '';
        trends.embed.renderExploreWidgetTo(divElem,"TIMESERIES", {"comparisonItem":[{"keyword":"dbs bank","geo":"","time":"today 12-m"}],"category":0,"property":""}, {"exploreQuery":"q=dbs bank&date=today 12-m","guestPath":"https://trends.google.com:443/trends/embed/"}); 
        console.log("HERE"); 
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
    let apiFilterState = this.createApiFilterState(this.state.startDate, this.state.endDate);
    this.next_fun();
    //this.getGoogleData();
    // tweetAPI.getFilteredMedia(apiFilterState, (error: any, response: any) => {});
    //epiAPI.getAnalyticReport(apiFilterState, (error: any, response: any) => {});
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
        let temp = (!isNull(date)) ? new Date(date) : date;
        if (!isNull(temp)) {
            if (dateType == 'endDate') {
                temp.setSeconds(temp.getSeconds() - 1);
                temp.setDate(temp.getDate() + 1);
            }
            temp = new Date(temp.getTime() - (temp.getTimezoneOffset() * 60000));
        }
        return (!isNull(temp) ? temp.toISOString().slice(0, -5) : '');
    }

    checkInputs() {
        if (this.state.disease.length == 0 || this.state.locations.length == 0 ||
            isNull(this.state.startDate) || isNull(this.state.endDate)) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        console.log(this.state.googleArticles);
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
                            <Button disabled={this.checkInputs()} onClick={this.onAnalyze}>Create Analytics</Button>
                        </div>
                    </div>
                    <div className='ArticleList-division' />
                        <FrequencyGraph />
                        <HeatMap />
                        <HistogramGraph title='Histogram of events related to Zika'/>
                        <MediaCoverage googleData={this.state.googleArticles}/>
                        <div id="sampDiv"></div>
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