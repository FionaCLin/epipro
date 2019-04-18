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
            apiState: undefined
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
        this.setState({apiState: null});
        epiAPI.getAnalyticReport(apiFilterState, (error: any, response: any) => {
            console.log(response);
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            } else {
                this.setState({apiState: response});
                console.log("LINE 45", response);
            }
        });
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
                        <AnalyticsReport startDate={this.state.startDate} endDate={this.state.endDate} apiState={this.state.apiState}/>
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
    apiState: undefined | null | IApiState;
}

export interface IApiState {
    event_graph: any;
    frequency_graph: any;
    heat_map: any;
}