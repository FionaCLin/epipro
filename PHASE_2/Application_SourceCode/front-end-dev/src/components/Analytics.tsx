import React from 'react';
import '../css/Home.css';
import TimeSearch from './TimeSearch';
import LocationSearch from './LocationSearch';
import { Button } from 'react-bootstrap';
import DiseaseSearch from './DiseaseSearch';
import { isNull, isNullOrUndefined, isUndefined } from 'util';
import Header from './Header';
import { BackendAPI, IAnalyticOptions } from '../API';
import FrequencyGraph from './FrequencyGraph';
import HeatMap from './Heatmap';
import { fitBounds } from 'google-map-react/utils';
import HistogramGraph, { HistBar } from './HistogramGraph';
import loading from '../imgs/loading1.gif';

let epiAPI = new BackendAPI();
declare var google: any;
let geoCoder = new google.maps.Geocoder();

export default class Analytics extends React.Component<IAnalyticsProps, IAnalyticsState> {
    constructor(props: IAnalyticsProps) {
        super(props);
        this.state = {
            disease: '',
            locations: [],
            startDate: null,
            endDate: null,
            frequencyData: undefined,
            heatmapPositions: undefined,
            histogramData: undefined,
            title: ''
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
        this.setState({
            heatmapPositions: null,
            frequencyData: null,
            histogramData: null
        });
        let apiFilterState = this.createApiFilterState(this.state.startDate, this.state.endDate);
        epiAPI.getAnalyticReport(apiFilterState, (error: any, response: any) => {
            console.log(response);
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
                console.log("LINE 45", response);
            }
        });
    }

    checkLoading() {
        if (isNull(this.state.frequencyData) || isNull(this.state.frequencyData) ||
            isNull(this.state.heatmapPositions)) {
          return <img src={loading} className="loading" alt="loading" />;
        } else if (isUndefined(this.state.frequencyData) && isUndefined(this.state.histogramData) &&
            isUndefined(this.state.heatmapPositions)) {
                return true;
        }
        return false;
    }

    private createHistogramData(apiEvent: any) {
        const histogramEvents: Array<HistBar> = [];
        const events = ['death', 'hospitalised', 'infected', 'presence', 'recovered'];
        for (let i = 0; i < events.length; i++) {
            histogramEvents.push({
                event: events[i],
                count: apiEvent[events[i]]
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
            this.geocodeAddress(apiHeatmap[i]);
        }
        return heatmapData;
    }

    private geocodeAddress(location: APIHeatmap) {
        geoCoder.geocode({address: location.location}, (results: any, status: any) => {
            let temp = {lat: 0, lng: 0, weight: 0, data: location};
            if (status === google.maps.GeocoderStatus.OK) {
                temp = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                    weight: this.assignWeight(location.number_affected),
                    data: location

                };
            }
            //console.log(temp);
            this.setState({heatmapPositions: this.state.heatmapPositions.concat([temp])});
            //console.log(this.state.heatmapPositions);
        });
    }

    private assignWeight(numberAffected: number) {
        const weightValues = [0, 10, 100, 250, 500, 750, 1000]
        for (let i = weightValues.length; i != 0; i--) {
            if (numberAffected > weightValues[i - 1]) return i;
        }
        return 0;
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

        let freqArray: Array<Frequency> = [];
        let temp: Frequency = { date: countStr, WHO: 0, Google: 0, Twitter: 0 };

        while (count <= endDate) {
            temp = { date: countStr, WHO: 0, Google: 0, Twitter: 0 };
            freqArray.push(temp);
            let sameDate = apiFrequency.filter(value => value.date == countStr);
            if (sameDate.length != 0) temp.WHO = sameDate[0].count;
            count.setDate(count.getDate() + 1);
            count.setHours(0, 0, 0, 0);
            countStr =  this.stringifyDates(count, 'startDate').substring(0, countStr.length);
        }
        console.log(apiFrequency);
        console.log('date', freqArray);
        return freqArray;
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

    private calculateBounds() {
        const bounds = new google.maps.LatLngBounds();
        let center = {lat: 0, lng: 0};
        let zoom = 1;
        
        if (this.state.heatmapPositions.length != 0) {
            this.state.heatmapPositions.forEach((marker: any) => {
                bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
            });

            let newBounds = {
                ne: {
                    lat: bounds.getNorthEast().lat(),
                    lng: bounds.getNorthEast().lng()
                },
                sw: {
                    lat: bounds.getSouthWest().lat(),
                    lng: bounds.getSouthWest().lng()
                }
            }
            let size = { width: 1000, height: 450 };
            let {center, zoom} = fitBounds(newBounds, size);
            return {center, zoom};
        }

        return {center, zoom};
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
                        {this.checkLoading()}
                        {this.checkLoading() == false ? (
                        <div>
                            <FrequencyGraph title={this.state.title} frequencyData={this.state.frequencyData}/>
                            <HeatMap
                                title={this.state.title}
                                locations={isNullOrUndefined(this.state.heatmapPositions) ? [] : this.state.heatmapPositions}
                                bounds={this.calculateBounds()}
                            />
                            <HistogramGraph title={this.state.title} histogramData={this.state.histogramData}/>
                        </div>
                        ) : (<div></div>)}
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
    heatmapPositions: any;
    histogramData: any;
    title: string;
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
    date: string;
    count: number;
}

export interface APIHeatmap {
    location: string;
    article_count: number;
    number_affected: number;
}

export interface GeoPosition {
    lat: number;
    lng: number;
    weight?: number;
    data?: APIHeatmap;
}