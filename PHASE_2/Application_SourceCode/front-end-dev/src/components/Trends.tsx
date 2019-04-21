import React from 'react';
import '../css/Home.css';
import TimeSearch from './TimeSearch';
import LocationSearch from './LocationSearch';
import { Button, ButtonGroup } from 'react-bootstrap';
import DiseaseSearch from './DiseaseSearch';
import GoogleAPI, { IFilterOptions } from '../Google';
import { isNull, isUndefined } from 'util';
import FrequencyGraph from './FrequencyGraph';
import MediaCoverage from './MediaCoverage';
import Header from './Header';
import { BackendAPI } from '../API';
import loading from '../imgs/loading1.gif';

let newsAPI = new GoogleAPI();
let epiAPI = new BackendAPI();
declare var trends: any;
const sections = ['frequency', 'media', 'gTrends'];
const gSections = [
    {div: 'gTrends', widget: 'TIMESERIES'},
    {div: 'gTopics', widget: 'RELATED_TOPICS'},
    {div: 'gQueries', widget: 'RELATED_QUERIES'}
];

export default class Trends extends React.Component<ITrendsProps, ITrendsState> {
    constructor(props: ITrendsProps) {
        super(props);
        let sessionTrends = sessionStorage.getItem('trends');
        if (isNull(sessionTrends)) {
            this.state = {
                title: '',
                disease: '',
                locations: [],
                startDate: null,
                endDate: null,
                googleArticles: [],
                frequencyData: undefined,
                tweets: [],
                googleCheck: 0,
                twitterCheck: 0,
                displaySection: 'frequency'
            };
        } else {
            let sessionState = JSON.parse(sessionTrends);
            sessionState.startDate = this.parseDates(sessionState.startDate);
            sessionState.endDate = this.parseDates(sessionState.endDate);
            this.state = sessionState;
            console.log(sessionState);
        }
        this.handleChange = this.handleChange.bind(this);
        this.onTrends = this.onTrends.bind(this);
        this.getGoogleData = this.getGoogleData.bind(this);
        this.createDateArray = this.createDateArray.bind(this);
    }

    private handleChange(event: any) {
        console.log(event);
        this.setState(event);
    }

    private parseDates(date: string | null) {
        return (!isNull(date) ? new Date(date) : date);
    }

    componentDidMount() {
        if (!isNull(sessionStorage.getItem('trends'))) this.getGoogleTrends();
    }

  getGoogleTrends(){
        let startDate = this.stringifyDates(this.state.startDate, 'startDate');
        let endDate = this.stringifyDates(this.state.endDate, 'endDate');
        startDate = startDate.substring(0, startDate.indexOf('T'));
        endDate = endDate.substring(0, endDate.indexOf('T'));
        let geo = "";
        if (this.state.locations.length == 1) {
            let location = this.state.locations[0];
            let country = location.substring(location.lastIndexOf(",") + 1);
            geo = epiAPI.getUNLOCode(country);
        }
        console.log(geo);

        let widgetCalls = [];
        for (let i = 0; i < gSections.length; i++) {
            let div = document.getElementById(gSections[i].div);
            if (!isNull(div)) div.innerHTML = '';
            widgetCalls.push({div: div, type: gSections[i].widget});
        }

        for (let i = 0; i < widgetCalls.length; i++) {
            trends.embed.renderExploreWidgetTo(widgetCalls[i].div, widgetCalls[i].type, {
                "comparisonItem":[{
                    "keyword":this.state.disease, "geo":geo, "time":`${startDate} ${endDate}`
                }],
                "category":0,
                "property":""
            }, {
                "exploreQuery":`q=${this.state.disease}&geo=${geo}&time=${startDate} ${endDate}`,
                "guestPath":"https://trends.google.com:443/trends/embed/"
            });
        }
    }

  createDateArray(startDate: string, endDate: string) {
        let count: Date = new Date(startDate);
        let dateArray: Array<IFrequencyData> = [];
        let countStr =  this.stringifyDates(count, 'startDate').substring(0, startDate.indexOf('T'));
        let endStr: string = endDate.substring(0, endDate.indexOf('T'));
        let temp: IFrequencyData = {date: countStr};

        while (countStr != endStr) {
            temp = { date: countStr, Twitter: 0, Google: 0 };
            dateArray.push(temp);
            count.setDate(count.getDate() + 1);
            countStr =  this.stringifyDates(count, 'startDate').substring(0, startDate.indexOf('T'));
        }
        temp = { date: endStr, Twitter: 0, Google: 0 };
        dateArray.push(temp);
        console.log('date', dateArray);
        return dateArray;
  }

  getGoogleData(dateArray: Array<IFrequencyData>) {
    let apiFilterState = this.createApiFilterState(this.state.startDate, this.state.endDate);
    this.setState({googleArticles: [], title: this.state.disease, googleCheck: 0});
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
            console.log(response);
            this.setState({googleArticles: this.state.googleArticles.concat(response.articles)});
            dateArray[i].Google = response.totalResults;
            this.setState({frequencyData: dateArray, googleCheck: this.state.googleCheck + 1})
        });

        count.setDate(count.getDate() + 1);
        count.setHours(0,0,0,0);
    }
  }

    getTwitterData(dateArray: Array<IFrequencyData>) {
        this.setState({tweets: [], twitterCheck: 0});

        let diseaseTweets = epiAPI.getTwitterData(this.state.disease);
        console.log(diseaseTweets);
        let newTweets: Array<string> = [];
        let filtered = this.filterByLocation(diseaseTweets);
        console.log(filtered);
        for (let i = 0; i < dateArray.length; i++) {
            let matched = filtered.filter(value => value.date == dateArray[i].date);
            dateArray[i].Twitter = matched.length;
            let ids = matched.map(value => (value.id));
            console.log(ids);
            console.log(ids.map(value => ('' + value)));
            newTweets = newTweets.concat(ids);
        }
        console.log(dateArray);
        console.log(newTweets);
        this.setState({tweets: newTweets, frequencyData: dateArray, twitterCheck: dateArray.length});
    }

    filterByLocation(diseaseTweets: Array<any>) {
        let filtered = diseaseTweets.map(value => value);
        if (this.state.locations.length != 0) {
            for (let i = 0; i < this.state.locations.length; i++) {
                let multiLocation = this.state.locations[i].indexOf(',');
                let location = this.state.locations[i];
                if (multiLocation != -1) location = location.substring(0, multiLocation);
                filtered = filtered.filter(value => (value.text.indexOf(location) != -1));
            }
        }
        return filtered;
    }

    private onTrends() {
        let startDate = this.stringifyDates(this.state.startDate, 'startDate');
        let endDate = this.stringifyDates(this.state.endDate, 'endDate');
        let dateArray = this.createDateArray(startDate, endDate);
        this.setState({frequencyData: dateArray});
        this.getGoogleTrends();
        this.getGoogleData(dateArray);
        this.getTwitterData(dateArray);
        this.setState({frequencyData: dateArray});
    }

    private createApiFilterState(startDate: Date | null, endDate: Date | null) {
        let apiFilterState: IFilterOptions = {
            disease: this.state.disease,
            location: this.state.locations.join(' ').replace(',', ' '),
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
        if (this.state.disease.length == 0 || isNull(this.state.startDate) || isNull(this.state.endDate)) {
            return true;
        } else {
            return false;
        }
    }

    checkLoading() {
        if (isUndefined(this.state.frequencyData)) {
            return true;
        } else if (this.state.googleCheck != this.state.frequencyData.length ||
                    this.state.twitterCheck != this.state.frequencyData.length) {
            return <img src={loading} className="loading" alt="loading" />;
        }
        sessionStorage.setItem('trends', JSON.stringify(this.state));
        return false;
    }

    changeSection(section: number) {
        if (this.state.displaySection != sections[section]) {
            this.setState({displaySection: sections[section]});
        }
    }

    render() {
        let currentDate = new Date();
        let monthBack = new Date(new Date().setDate(currentDate.getDate() - 30));
        console.log(this.state.googleCheck, this.state.frequencyData, this.state.twitterCheck);
        let display = (this.checkLoading() == false) ? 'block' : 'none';
        return (
            <div className="bg">
                <Header />
                <body id="top">
                    <div className="Main">
                        <h1>TRENDS</h1>
                        <div id="collapse-filters" className="Filter-panel">
                            <DiseaseSearch disease={this.state.disease} updateDisease={this.handleChange}/>
                            <LocationSearch locations={this.state.locations} updateLocation={this.handleChange}/>
                            <TimeSearch startDate={this.state.startDate} endDate={this.state.endDate} minDate={monthBack} updateTime={this.handleChange}/>
                            <Button disabled={this.checkInputs()} onClick={() => this.onTrends()}>Create Trends</Button>
                        </div>
                        <hr />
                        {this.checkLoading()}
                        <div style={{display: display}}>
                            <ButtonGroup vertical className="Report-menu">
                                <Button size="lg" className="Report-title">{this.state.title.charAt(0).toUpperCase() + this.state.title.slice(1)} Trends</Button>
                                <Button variant={this.state.displaySection == 'frequency' ? "primary" : "secondary"} onClick={() => this.changeSection(0)}>Frequency Mentions</Button>
                                <Button variant={this.state.displaySection == 'media' ? "primary" : "secondary"} onClick={() => this.changeSection(1)}>Media Coverage</Button>
                                <Button variant={this.state.displaySection == 'gTrends' ? "primary" : "secondary"} onClick={() => this.changeSection(2)}>Google Trends</Button>
                            </ButtonGroup>
                            <div className="Report-display">
                                <div style={{display: this.state.displaySection == 'frequency' ? 'block' : 'none'}}>
                                    <FrequencyGraph
                                        title={this.state.title}
                                        titleType={'Google News and Twitter'}
                                        types={['Google', 'Twitter']}
                                        frequencyData={this.state.frequencyData}/>
                                </div>
                                <div style={{display: this.state.displaySection == 'media' ? 'block' : 'none'}}>
                                    <MediaCoverage googleData={this.state.googleArticles} tweetData={this.state.tweets}/>
                                </div>
                                <div style={{display: this.state.displaySection == 'gTrends' ? 'block' : 'none'}}>
                                    <div id="gTrends"/>
                                    <br></br>
                                    <div id="gTopics" className="GTrends"/>
                                    <div id="gQueries" className="GTrends"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </div>
        );
    }
}

interface ITrendsProps {
}

interface ITrendsState {
    title: string;
    disease: string;
    locations: Array<string>;
    startDate: Date | null;
    endDate: Date | null;
    googleArticles: Array<any>;
    tweets: Array<string>;
    frequencyData: Array<IFrequencyData> | undefined;
    googleCheck: number;
    twitterCheck: number;
    displaySection: string;
}

interface IFrequencyData {
    date: string;
    WHO?: number;
    Google?: number;
    Twitter?: number;
    [key: string]: number | string | undefined;
}