import React from 'react';
import '../css/Home.css';
import TimeSearch from './TimeSearch';
import LocationSearch from './LocationSearch';
import { Button } from 'react-bootstrap';
import DiseaseSearch from './DiseaseSearch';
import { isNull } from 'util';
import Header from './Header';
import { BackendAPI, IAnalyticOptions } from '../API';
import AnalyticsReport from './AnalyticsReport';

let epiAPI = new BackendAPI();

export default class Analytics extends React.Component<IAnalyticsProps, IAnalyticsState> {
    constructor(props: IAnalyticsProps) {
        super(props);
        this.state = {
            disease: '',
            locations: [],
            startDate: null,
            endDate: null,
            frequencyData: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.onAnalyze = this.onAnalyze.bind(this);
    }

    private handleChange(event: any) {
        // console.log(event);
        this.setState(event);
    }

    private onAnalyze() {
        console.log("ANALYZE");
        let apiFilterState = this.createApiFilterState(this.state.startDate, this.state.endDate);
        epiAPI.getAnalyticReport(apiFilterState, (error: any, response: any) => {
            console.log(response);
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            } else {
                this.setState({frequencyData: this.createFrequencyData(response.frequency_graph.frequency)});
                console.log("LINE 45", response);
            }
        });
    }

    private createFrequencyData(apiFrequency: Array<APIFrequency>) {
        console.log("INSIDE", apiFrequency);
        let count = (!isNull(this.state.startDate)) ? new Date(this.state.startDate) : new Date(2017, 0, 1);
        let endDate = (!isNull(this.state.endDate)) ? new Date(this.state.endDate) : new Date();
        endDate.setHours(0, 0, 0, 0);

        let countStr: string = this.stringifyDates(count, 'startDate');
        let endStr: string = this.stringifyDates(endDate, 'endDate');
        countStr =  countStr.substring(0, countStr.indexOf('T'));
        endStr = endStr.substring(0, endStr.indexOf('T'));

        let dateArray: Array<Frequency> = [];
        let temp: Frequency = { date: countStr, WHO: 0, Google: 0, Twitter: 0 };

        while (count <= endDate) {
            temp = { date: countStr, WHO: 0, Google: 0, Twitter: 0 };
            dateArray.push(temp);
            let sameDate = apiFrequency.filter(value => value.date == countStr);
            if (sameDate.length != 0) temp.WHO = sameDate[0].count;
            count.setDate(count.getDate() + 1);
            count.setHours(0, 0, 0, 0);
            console.log(count);
            countStr =  this.stringifyDates(count, 'startDate').substring(0, countStr.length);
        }
        console.log(apiFrequency);
        console.log('date', dateArray);
        return dateArray;
    }

    private createApiFilterState(startDate: Date | null, endDate: Date | null) {
        let apiFilterState: IAnalyticOptions = {
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
        return (this.state.disease.length == 0);
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
                            <Button disabled={this.checkInputs()} onClick={this.onAnalyze}>Create Analytics</Button>
                        </div>
                    </div>
                    <div className='ArticleList-division' />
                        <AnalyticsReport frequencyData={this.state.frequencyData}/>
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
    frequencyData: any;
}

export interface IApiState {
    event_graph: any;
    frequency_graph: any;
    heat_map: any;
}

export interface Frequency {
    date: string;
    WHO: number;
    Twitter: number;
    Google: number;
}

interface APIFrequency {
    date: string,
    count: number
}