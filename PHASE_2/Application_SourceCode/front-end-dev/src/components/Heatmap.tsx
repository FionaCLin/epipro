import React from 'react';
import '../css/Home.css';
import GoogleMapReact from 'google-map-react';
import { Card, ListGroup, Button, Collapse } from 'react-bootstrap';
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

    private toggleCollapse() {
        this.setState({
            collapse: !this.state.collapse
        });
    }

  render() {
      //console.log(this.props.locations);
      //console.log(this.props.bounds);
    return (
        <div>
            <Button
                onClick={() => this.toggleCollapse()}
                aria-controls="heatmap"
                aria-expanded={this.state.collapse}
                variant="secondary"
                block
            >
                Heatmap
            </Button>
            <Collapse in={this.state.collapse}>
                <div id="heatmap">
                    <div className="Analytics-collapse">
                        <div style={{height: '450px', width: '70%', float: "left"}}>
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
                        <div style={{float: "left", height: '450px', marginLeft: '10px', width: '29%'}}>
                            <Card style={{height:"100%"}}>
                                <Card.Header as="h5">{this.props.title.charAt(0).toUpperCase() + this.props.title.slice(1)} occurences</Card.Header>
                                <Card.Body style={{overflowY: 'auto'}}>
                                    <ListGroup variant="flush">
                                        {this.props.locations.map((value:any) =>
                                        <ListGroup.Item>
                                            {value.data.location}
                                        </ListGroup.Item>)}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </Collapse>
            <br></br>
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