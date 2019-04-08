import React from 'react';
import '../css/Home.css';
import GoogleMapReact from 'google-map-react';
import { Card, ListGroup, Button, Collapse } from 'react-bootstrap';

let mapsAPIkey = { key: 'AIzaSyAWAexUwY_tKggKe5GoqUmdCLV3h8si3Co' };

export default class HeatMap extends React.Component<IHeatMapProps, IHeatMapState> {
    constructor(props: IHeatMapProps) {
        super(props);
        this.state = {
            collapse: true
        };
    }

    static defaultProps = {
        heatMapData: {
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
        },
        defaultZoom: 13,
        defaultCenter: {
            lat: 37.774546,
            lng: -122.433523
        }
  }

    private toggleCollapse() {
        this.setState({
            collapse: !this.state.collapse
        });
    }

  render() {
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
                                defaultCenter={this.props.defaultCenter}
                                defaultZoom={this.props.defaultZoom}
                                heatmapLibrary={true}
                                heatmap={this.props.heatMapData}
                            >
                            </GoogleMapReact>
                        </div>
                        <div style={{float: "left", height: '450px', marginLeft: '10px', width: '29%'}}>
                            <Card style={{height:"100%"}}>
                                <Card.Header as="h5">Zika occurences</Card.Header>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Lower Pacific Heights, California, USA <div style={{float: 'right'}}><b>311</b></div></ListGroup.Item>
                                        <ListGroup.Item>Marina District, California, USA <div style={{float: 'right'}}><b>25</b></div></ListGroup.Item>
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
    locations?: Array<object>;
    defaultCenter?: GeoPosition;
    defaultZoom?: number;
    heatMapData?: IHeatMap;
}

interface IHeatMapState {
    collapse: boolean;
}

interface IHeatMap {
    positions: Array<GeoPosition>;
    options: PositionWeight;
}

interface GeoPosition {
    lat: number;
    lng: number;
}

interface PositionWeight {
    radius: number;
    opacity: number;
}