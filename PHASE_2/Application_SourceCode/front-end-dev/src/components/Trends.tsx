import React from 'react';
import '../css/Basic.css';
import '../css/Trends.css';
import TimeSearch from './TimeSearch';
import LocationSearch from './LocationSearch';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import DiseaseSearch from './DiseaseSearch';
import GoogleAPI from '../Google';
import { isNull, isUndefined } from 'util';
import FrequencyGraph, { Frequency } from './FrequencyGraph';
import MediaCoverage from './MediaCoverage';
import Header from './Header';
import { BackendAPI } from '../API';
import loading from '../imgs/loading1.gif';
import { Tooltip } from './Tooltip';
import { stringifyDates, createApiFilterState, parseDates, shortenDate, capitalize } from './util';
import { filterByLocation } from './TweetList';
import PageMenu from './PageMenu';

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
            sessionState.startDate = parseDates(sessionState.startDate);
            sessionState.endDate = parseDates(sessionState.endDate);
            this.state = sessionState;
            console.log(sessionState);
        }
        this.handleChange = this.handleChange.bind(this);
        this.onTrends = this.onTrends.bind(this);
        this.getGoogleData = this.getGoogleData.bind(this);
    }

    componentDidMount() {
        if (!isNull(sessionStorage.getItem('trends'))) this.getGoogleTrends();
    }

    private getGoogleTrends(){
        let startDate = stringifyDates(this.state.startDate, 'startDate');
        let endDate = stringifyDates(this.state.endDate, 'endDate');
        startDate = shortenDate(startDate);
        endDate = shortenDate(endDate);
        let geo = "";
        if (this.state.locations.length == 1) {
            let location = this.state.locations[0];
            let country = location.substring(location.lastIndexOf(",") + 1);
            geo = epiAPI.getUNLOCode(country);
        }

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

    private getGoogleData(dateArray: Array<Frequency>) {
        let apiFilterState = createApiFilterState(this.state);
        apiFilterState.location = this.state.locations.join(' ').replace(',', ' ');
        this.setState({
            googleArticles: [],
            title: capitalize(this.state.disease),
            googleCheck: 0
        });
        let count: Date = new Date(apiFilterState.startDate);

        for (let i = 0; i < dateArray.length; i++) {
            let countStart = stringifyDates(count, 'startDate');
            let countEnd = stringifyDates(count, 'endDate');
            apiFilterState['startDate'] = countStart;
            apiFilterState['endDate'] = countEnd;

            newsAPI.getFilteredMedia(apiFilterState, (error: any, response: any) => {
                if (error && error.response) {
                    let message = error.response.data.message
                    console.log('error message', message);
                } else if (error) {
                    console.log('error message', error.message);
                } else {
                    this.setState({googleArticles: this.state.googleArticles.concat(response.articles)});
                    dateArray[i].Google = response.totalResults;
                    this.setState({frequencyData: dateArray, googleCheck: this.state.googleCheck + 1});
                }
            });

            count.setDate(count.getDate() + 1);
            count.setHours(0,0,0,0);
        }
    }

    private getTwitterData(dateArray: Array<Frequency>) {
        this.setState({tweets: [], twitterCheck: 0});

        let apiFilterState = createApiFilterState(this.state);
        epiAPI.getTwitterData(apiFilterState, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            } else {
                let newTweets: Array<string> = [];
                let diseaseTweets = JSON.parse(response).filter((value:any) => value.disease == apiFilterState.disease);
                diseaseTweets = (diseaseTweets.length == 0) ? [] : diseaseTweets[0].tweets;
                let filtered = filterByLocation(diseaseTweets, this.state.locations);
                for (let i = 0; i < dateArray.length; i++) {
                    let matched = filtered.filter(value => value.date == dateArray[i].date);
                    dateArray[i].Twitter = matched.length;
                    let ids = matched.map(value => (value.id));
                    newTweets = newTweets.concat(ids);
                }
                this.setState({tweets: newTweets.reverse(), frequencyData: dateArray, twitterCheck: dateArray.length});
            }
        });
    }

    private onTrends() {
        let dateArray = this.createDateArray();
        this.setState({frequencyData: dateArray, displaySection: 'frequency'});
        this.getGoogleTrends();
        this.getGoogleData(dateArray);
        this.getTwitterData(dateArray);
        this.setState({frequencyData: dateArray});
    }

    private createDateArray() {
        let startDate = stringifyDates(this.state.startDate, 'startDate');
        let endDate = stringifyDates(this.state.endDate, 'endDate');
        let count: Date = new Date(startDate);
        let dateArray: Array<Frequency> = [];
        let countStr =  stringifyDates(count, 'startDate').substring(0, startDate.indexOf('T'));
        let endStr: string = shortenDate(endDate);
        let temp: Frequency = {date: countStr};
    
        while (countStr != endStr) {
            temp = { date: countStr, Twitter: 0, Google: 0 };
            dateArray.push(temp);
            count.setDate(count.getDate() + 1);
            countStr =  stringifyDates(count, 'startDate').substring(0, startDate.indexOf('T'));
        }
        temp = { date: endStr, Twitter: 0, Google: 0 };
        dateArray.push(temp);
        return dateArray;
    }
    
    private handleChange(event: any) {
        this.setState(event);
    }

    private checkInputs() {
        return (this.state.disease.length == 0 || isNull(this.state.startDate) || isNull(this.state.endDate));
    }

    private checkLoading() {
        if (isUndefined(this.state.frequencyData)) {
            return true;
        } else if (this.state.googleCheck != this.state.frequencyData.length ||
                    this.state.twitterCheck != this.state.frequencyData.length) {
            return <img src={loading} className="loading" alt="loading" />;
        }
        sessionStorage.setItem('trends', JSON.stringify(this.state));
        return false;
    }

    private changeSection(section: number) {
        if (this.state.displaySection != sections[section]) {
            this.setState({displaySection: sections[section]});
        }
    }

    render() {
        let currentDate = new Date();
        let monthBack = new Date(new Date().setDate(currentDate.getDate() - 30));
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
                        <Form.Text className="text-muted">
                                * All filters except location are required.
                        </Form.Text>
                        <hr />
                        {this.checkLoading()}
                        <div style={{display: display}}>
                            <ButtonGroup vertical className="Report-menu">
                                <Button size="lg" className="Report-title">{capitalize(this.state.title)} Trends</Button>
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
                                    <MediaCoverage title={this.state.title} googleData={this.state.googleArticles} tweetData={this.state.tweets}/>
                                </div>
                                <div style={{display: this.state.displaySection == 'gTrends' ? 'block' : 'none'}}>
                                    <p className="Section-title">
                                        <b>Google Trends on {this.state.title}</b>
                                        <Tooltip description={'Google trends reflects the trends of Google search terms within time range.'} />
                                    </p>
                                    <div id="gTrends"/>
                                    <br></br>
                                    <div id="gTopics" className="GTrends"/>
                                    <div id="gQueries" className="GTrends"/>
                                </div>
                            </div>
                        </div>
                        <div style={(display == 'none') && (this.checkLoading() == true) ? {display: 'block'} : {display: 'none'}}>
                            <PageMenu type="trends" />
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
    frequencyData: Array<Frequency> | undefined;
    googleCheck: number;
    twitterCheck: number;
    displaySection: string;
}