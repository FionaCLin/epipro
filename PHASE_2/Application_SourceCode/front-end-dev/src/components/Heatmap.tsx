import React from 'react';
import '../css/Home.css';
import GoogleMapReact from 'google-map-react';
import { fitBounds } from 'google-map-react/utils';
import { Table } from 'react-bootstrap';
import Marker from './Marker';
import { isUndefined, isNullOrUndefined } from 'util';
import { Tooltip } from './Tooltip';

declare var google: any;
let mapsAPIkey = { key: 'AIzaSyAWAexUwY_tKggKe5GoqUmdCLV3h8si3Co' };

export default class HeatMap extends React.Component<IHeatMapProps, IHeatMapState> {
    constructor(props: IHeatMapProps) {
        super(props);
        this.state = {
            collapse: true
        };
    }

    private calculateBounds() {
        const bounds = new google.maps.LatLngBounds();
        let center = {lat: 0, lng: 0};
        let zoom = 1;
        if (isNullOrUndefined(this.props.locations)) return {center, zoom};
        if (this.props.locations.length != 0) {
            this.props.locations.forEach((marker: GeoPosition) => {
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

    render() {
        let {center, zoom} = this.calculateBounds();
        return (
            <div id="heatmap" className="Section-title">
                <p>
                    <b>Heatmap of the occurences of {this.props.title}</b>
                    <Tooltip description={`Shows the occurences of ${this.props.title} worldwide or within the geographical range of location inputs.`} />
                </p>
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
                        center={center}
                        zoom={zoom}
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
                        {this.props.locations.map((value: GeoPosition) => 
                        (!isNullOrUndefined(value.data)) ?
                        <tr>
                            <td>{value.data.location}</td>
                            <td>{value.data.number_affected}</td>
                            <td>{value.data.article_count}</td>
                        </tr> : <div></div>)}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export function assignWeight(numberAffected: number) {
    const weightValues = [0, 10, 100, 250, 500, 750, 1000, 2000, 5000]
    for (let i = weightValues.length; i != 0; i--) {
        if (numberAffected > weightValues[i - 1]) return i;
    }
    return 0;
}

interface IHeatMapProps {
    title: string;
    locations: Array<GeoPosition>;
}

interface IHeatMapState {
    collapse: boolean;
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