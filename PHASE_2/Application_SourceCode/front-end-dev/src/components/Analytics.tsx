import React from 'react';
import '../css/Home.css';
import TimeSearch from './TimeSearch';
import LocationSearch from './LocationSearch';
import { Button } from 'react-bootstrap';
import DiseaseSearch from './DiseaseSearch';
import GoogleAPI, { IFilterOptions } from '../Google';
import { isNull } from 'util';
import GoogleMapReact from 'google-map-react';
import {LineChart} from 'recharts';

let newsAPI = new GoogleAPI();
let mapsAPIkey = 'AIzaSyAWAexUwY_tKggKe5GoqUmdCLV3h8si3Co';
//http://recharts.org/en-US/examples

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
        //this.setState({});
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
    let heatMapData = {
        positions: [
          {lat: 37.782551, lng: -122.445368},
          {lat: 37.782745, lng: -122.444586},
          {lat: 37.782842, lng: -122.443688},
          {lat: 37.782919, lng: -122.442815},
          {lat: 37.782992, lng: -122.442112},
          {lat: 37.783100, lng: -122.441461},
          {lat: 37.783206, lng: -122.440829},
          {lat: 37.783273, lng: -122.440324},
          {lat: 37.783316, lng: -122.440023},
          {lat: 37.783357, lng: -122.439794},
          {lat: 37.783371, lng: -122.439687},
          {lat: 37.783368, lng: -122.439666},
          {lat: 37.783383, lng: -122.439594},
          {lat: 37.783508, lng: -122.439525},
          {lat: 37.783842, lng: -122.439591},
          {lat: 37.784147, lng: -122.439668},
          {lat: 37.784206, lng: -122.439686},
          {lat: 37.784386, lng: -122.439790},
          {lat: 37.784701, lng: -122.439902},
          {lat: 37.784965, lng: -122.439938},
          {lat: 37.785010, lng: -122.439947},
          {lat: 37.785360, lng: -122.439952},
          {lat: 37.785715, lng: -122.440030},
          {lat: 37.786117, lng: -122.440119},
          {lat: 37.786564, lng: -122.440209},
          {lat: 37.786905, lng: -122.440270},
          {lat: 37.786956, lng: -122.440279},
          {lat: 37.800224, lng: -122.433520},
        ],
        options: {
            radius: 20,
            opacity: 0.6
        }
    }
    return (
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
            <div style={{height: '100vh', width: '100% '}}>
            <GoogleMapReact
                bootstrapURLKeys={{key: mapsAPIkey}}
                defaultCenter={{lat: 37.774546, lng: -122.433523}}
                defaultZoom={13}
                heatmapLibrary={true}
                heatmap={heatMapData}
            />
            </div>
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