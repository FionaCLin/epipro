import React from 'react';
import '../css/Home.css';
import { isNullOrUndefined } from 'util';
import { Badge } from 'react-bootstrap';

export default class EventReport extends React.Component<IEventReportProps, IEventReportState> {
  constructor(props: IEventReportProps) {
    super(props);
  }
  
  LocationCheck(location: LocationBasic | LocationAdvanced) {
      let locationProp = null;
      if (!isNullOrUndefined(location['geonames-id'])) {
        locationProp = <p><b>Location:</b> {location['geonames-id']}</p>;
      } else {
        locationProp = <p><b>Location:</b> {location.location}, {location.country}</p>
      }
      return locationProp;
  }

  render() {
    return (
        <div>
            <p><b>Type: </b> 
                <Badge className="Badge-division" variant="secondary">
                    {this.props.type}
                </Badge>
            </p>
            <p><b>Date:</b> {this.props.date}</p>
            {this.LocationCheck(this.props.location)}
            <p><b>Number Affected:</b> {this.props['number-affected']}</p>
        </div>
        
    );
  }
}

interface LocationAdvanced {
    'geonames-id': number;
    [key: string]: number;
}

interface LocationBasic {
    country: string;
    location: string;
    [key: string]: string;
}

interface IEventReportProps {
  type: string;
  date: string;
  location: LocationAdvanced | LocationBasic;
  'number-affected': number;
}

interface IEventReportState {    
}