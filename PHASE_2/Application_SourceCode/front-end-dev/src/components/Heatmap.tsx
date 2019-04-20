import React from 'react';
import '../css/Home.css';
import GoogleMapReact from 'google-map-react';
import { Card, ListGroup, Button, Collapse, Table } from 'react-bootstrap';
import { GeoPosition, APIHeatmap } from './Analytics';
import Marker from './Marker';
import { isUndefined } from 'util';

let mapsAPIkey = { key: 'AIzaSyAWAexUwY_tKggKe5GoqUmdCLV3h8si3Co' };


export default class HeatMap extends React.Component<IHeatMapProps, IHeatMapState> {
    constructor(props: IHeatMapProps) {
        super(props);
        this.state = {
            collapse: true
        };
    }

  render() {
    return (
        <div id="heatmap">
            <div style={{height: '700px'}}>
                <GoogleMapReact
                    bootstrapURLKeys={mapsAPIkey}
                    defaultCenter={{lat: 0, lng: 0}}
                    defaultZoom={1}
                    heatmapLibrary={true}
                    heatmap={{
                        positions: this.props.locations,
                        options: {
                            radius: 30,
                            opacity: 0.6
                        }
                    }}
                    center={this.props.bounds.center}
                    zoom={this.props.bounds.zoom}
                >
                    {this.props.locations.map(value =>
                    <Marker
                        lat={value.lat}
                        lng={value.lng}
                        location={!isUndefined(value.data) ? value.data.location : ''}
                        number_affected={!isUndefined(value.data) ? value.data.number_affected : 0}
                        article_count={!isUndefined(value.data) ? value.data.article_count: 0}

                    />)}

                </GoogleMapReact>
            </div>
            <br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Number affected</th>
                        <th>Article mentions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.locations.length == 0 ? <tr>
                        <td colSpan={3}>No results found</td>
                    </tr> : <div></div>}
                    {this.props.locations.map((value: any) => <tr>
                        <td>{value.data.location}</td>
                        <td>{value.data.number_affected}</td>
                        <td>{value.data.article_count}</td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    );
  }
}

interface IHeatMapProps {
    locations: Array<GeoPosition>;
    bounds: {center: GeoPosition, zoom: number};
    title: string;
}

interface IHeatMapState {
    collapse: boolean;
}

interface IHeatMap {
    positions: Array<GeoPosition>;
    options: PositionWeight;
}

interface PositionWeight {
    radius: number;
    opacity: number;
}