import React from 'react';
import '../css/Basic.css';
import TimeSearch from './TimeSearch';
import LocationSearch from './LocationSearch';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import DiseaseSearch from './DiseaseSearch';
import { isNull, isNullOrUndefined, isUndefined } from 'util';
import Header from './Header';
import { BackendAPI } from '../API';

import FrequencyGraph, { Frequency } from './FrequencyGraph';
import HeatMap, { APIHeatmap, GeoPosition, assignWeight } from './Heatmap';
import HistogramGraph, { HistBar, APIEvent, HistogramData } from './HistogramGraph';
import loading from '../imgs/loading1.gif';
import { parseDates, stringifyDates, createApiFilterState, shortenDate, capitalize } from './util';
import PageMenu from './PageMenu';

declare var google: any;
let epiAPI = new BackendAPI();
const sections = ['frequency', 'heatmap', 'event'];
let geoCoder = new google.maps.Geocoder();


export default class Analytics extends React.Component<IAnalyticsProps, IAnalyticsState> {
    constructor(props: IAnalyticsProps) {
        super(props);
        let sessionAnalyze = sessionStorage.getItem('analyze');
        if (isNull(sessionAnalyze)) {
            this.state = {
                disease: '',
                locations: [],
                startDate: null,
                endDate: null,
                frequencyData: undefined,
                heatmapPositions: undefined,
                histogramData: undefined,
                title: '',
                displaySection: sections[0]
            };
        } else {
            let sessionState = JSON.parse(sessionAnalyze);
            sessionState.startDate = parseDates(sessionState.startDate);
            sessionState.endDate = parseDates(sessionState.endDate);
            this.state = sessionState;
        }
        this.handleChange = this.handleChange.bind(this);
        this.onAnalyze = this.onAnalyze.bind(this);
    }

    private onAnalyze() {
        this.setState({
            heatmapPositions: null,
            frequencyData: null,
            histogramData: null,
            displaySection: sections[0]
        });
        let apiFilterState = createApiFilterState(this.state);
        epiAPI.getAnalyticReport(apiFilterState, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            } else {
                this.createHeatMapData(response.heat_map.locations);
                this.setState({
                    frequencyData: this.createFrequencyData(response.frequency_graph.frequency),
                    histogramData: this.createHistogramData(response.event_graph),
                    title: this.state.disease
                });
            }
        });
    }

    private createHistogramData(apiEvent: APIEvent) {
        const histogramEvents: Array<HistBar> = [];
        const events = ['death', 'hospitalised', 'infected', 'presence', 'recovered'];
        for (let i = 0; i < events.length; i++) {
            histogramEvents.push({
                event: events[i],
                count: apiEvent[events[i]] as number
            });
        }
        return {
            startDate: apiEvent.start_date,
            endDate: apiEvent.end_date,
            events: histogramEvents
        }
    }

    private createHeatMapData(apiHeatmap: Array<APIHeatmap>) {
        let heatmapData: Array<GeoPosition> = [];
        this.setState({heatmapPositions: []})
        for (let i = 0; i < apiHeatmap.length; i++) {
            geoCoder.geocode({address: apiHeatmap[i].location}, (results: any, status: any) => {
                let temp = {lat: 0, lng: 0, weight: 0, data: apiHeatmap[i]};
                if (status === google.maps.GeocoderStatus.OK) {
                    temp = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                        weight: assignWeight(apiHeatmap[i].number_affected),
                        data: apiHeatmap[i]

                    };
                }
                if (!isNullOrUndefined(this.state.heatmapPositions)) {
                    this.setState({heatmapPositions: this.state.heatmapPositions.concat([temp])});
                }
            });
        }
        return heatmapData;
    }

    private createFrequencyData(apiFrequency: Array<APIFrequency>) {
        let count = (!isNull(this.state.startDate)) ? new Date(this.state.startDate) : new Date(2017, 0, 1);
        let endDate = (!isNull(this.state.endDate)) ? new Date(this.state.endDate) : new Date();
        endDate.setHours(0, 0, 0, 0);

        let countStr: string = stringifyDates(count, 'startDate');
        let endStr: string = stringifyDates(endDate, 'endDate');
        countStr =  shortenDate(countStr);
        endStr = shortenDate(endStr);

        let freqArray: Array<Frequency> = [];
        let temp: Frequency = { date: countStr, WHO: 0, Google: 0, Twitter: 0 };

        while (count <= endDate) {
            temp = { date: countStr, WHO: 0, Google: 0, Twitter: 0 };
            freqArray.push(temp);
            let sameDate = apiFrequency.filter(value => value.date == countStr);
            if (sameDate.length != 0) temp.WHO = sameDate[0].count;
            count.setDate(count.getDate() + 1);
            count.setHours(0, 0, 0, 0);
            countStr =  stringifyDates(count, 'startDate').substring(0, countStr.length);
        }
        return freqArray;
    }

    private handleChange(event: any) {
        this.setState(event);
    }

    private checkInputs() {
        return (this.state.disease.length == 0);
    }

    private changeSection(section: number) {
        if (this.state.displaySection != sections[section]) {
            this.setState({displaySection: sections[section]});
        }
    }

    private checkLoading() {
        if (isNull(this.state.frequencyData) || isNull(this.state.frequencyData) ||
            isNull(this.state.heatmapPositions)) {
          return <img src={loading} className="loading" alt="loading" />;
        } else if (isUndefined(this.state.frequencyData) && isUndefined(this.state.histogramData) &&
            isUndefined(this.state.heatmapPositions)) {
                return true;
        }
        sessionStorage.setItem('analyze', JSON.stringify(this.state));
        return false;
    }

    render() {
        let display = (this.checkLoading() == false) ? 'block' : 'none';
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
                            <Button disabled={this.checkInputs()} onClick={this.onAnalyze}>Create Analytics</Button>
                        </div>
                        <Form.Text className="text-muted">
                                * Disease filter is required. Other filters are optional.
                        </Form.Text>
                        <hr />
                        {this.checkLoading()}
                        <div style={{display: display}}>
                            <ButtonGroup vertical className="Report-menu">
                                <Button size="lg" className="Report-title">{capitalize(this.state.title)} Analytics</Button>
                                <Button variant={this.state.displaySection == 'frequency' ? "primary" : "secondary"} onClick={() => this.changeSection(0)}>Frequency Mentions</Button>
                                <Button variant={this.state.displaySection == 'heatmap' ? "primary" : "secondary"} onClick={() => this.changeSection(1)}>Heatmap</Button>
                                <Button variant={this.state.displaySection == 'event' ? "primary" : "secondary"} onClick={() => this.changeSection(2)}>Event Histogram</Button>
                            </ButtonGroup>
                            <div className="Report-display">
                                <div style={{display: this.state.displaySection == 'frequency' ? 'block' : 'none'}}>
                                    <FrequencyGraph
                                        title={this.state.title}
                                        titleType='articles at WHO'
                                        types={['WHO']}
                                        frequencyData={this.state.frequencyData}
                                    />
                                </div>
                                <div style={{display: this.state.displaySection == 'heatmap' ? 'block' : 'none'}}>
                                    <HeatMap
                                        title={this.state.title}
                                        locations={isNullOrUndefined(this.state.heatmapPositions) ? [] : this.state.heatmapPositions}
                                    />
                                </div>
                                <div style={{display: this.state.displaySection == 'event' ? 'block' : 'none'}}>
                                    <HistogramGraph
                                        title={this.state.title}
                                        histogramData={this.state.histogramData}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={(display == 'none') && (this.checkLoading() == true) ? {display: 'block'} : {display: 'none'}}>
                                <PageMenu type="analyze" />
                        </div>
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
    frequencyData: Array<Frequency> | null | undefined;
    heatmapPositions: Array<GeoPosition> | null | undefined;
    histogramData: HistogramData | null | undefined;
    title: string;
    displaySection: string;
}

interface APIFrequency {
    date: string;
    count: number;
}
