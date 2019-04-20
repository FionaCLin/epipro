import React from 'react';
import '../css/Home.css';
import { isNullOrUndefined } from 'util';
import { Badge, Table } from 'react-bootstrap';

export default class EventReport extends React.Component<IEventReportProps, IEventReportState> {
  constructor(props: IEventReportProps) {
    super(props);
  }
  
  checkLocation(location: LocationBasic | LocationAdvanced) {
      if (!isNullOrUndefined(location['geonames-id'])) {
        return <tr><th>Location</th><td>{location['geonames-id']}</td></tr>;
      } else {
        return this.cleanLocation(location);
      }
  }

    cleanLocation(location: LocationBasic) {
        let locationArray: Array<string> = [];
        if (!isNullOrUndefined(location.location) && location.location != '') {
            locationArray = [location.location];
            if (location.location.indexOf(';') != -1) {
                locationArray = location.location.split(';');
            }
            for (let i = 0; i < locationArray.length; i++) {
                if (!isNullOrUndefined(location.country) && location.country != '') {
                    locationArray[i] += ',' + location.country;
                }
                locationArray[i] = locationArray[i].replace(/,/g, ', ');
            }
        } else if (!isNullOrUndefined(location.country) && location.country != '') {
            locationArray = [location.country];
        }
        if (locationArray.length != 0) {
            return <tr><th>Location</th>{locationArray.map(value => <td>{value}</td>)}</tr>;
        }
    }

    checkType(type: string, colSpan: number) {
        if (!isNullOrUndefined(type) && type != '') {
            return <tr><th>Event type</th><td colSpan={colSpan}>{type.charAt(0).toUpperCase() + type.slice(1)}</td></tr>;
        } else {
            return <tr><th>Event type</th><td colSpan={colSpan}>Unknown</td></tr>;
        }
    }

    checkDate(date: string, colSpan: number) {
        if (!isNullOrUndefined(date) && date != '') {
            let temp = (date.indexOf(' to ') != 1) ? date.split(' to ') : [date];
            for (let i = 0; i < temp.length; i++) {
                temp[i] = temp[i].substring(0, temp[i].indexOf('T'))
                    .split('-')
                    .reverse()
                    .join('/');
            }
            return <tr><th>Date</th><td colSpan={colSpan}>{temp.join(' to ')}</td></tr>;
        }
    }

    checkNumberAffected(affected: number, colSpan: number) {
        if (!isNullOrUndefined(affected)) {
            return <tr><th>Number affected</th><td colSpan={colSpan}>{affected}</td></tr>
        }
    }

    checkColSpan(location: LocationAdvanced | LocationBasic) {
        let colSpan = 1;
        if (!isNullOrUndefined(location.location) && location.location.indexOf(';') != -1) {
            colSpan = location.location.split(';').length;
        }
        return colSpan;
    }

  render() {
    let colSpan = this.checkColSpan(this.props.location);
    return (
        <div>
            <Table striped bordered hover style={{marginBottom: '0px'}}>
                <tbody>
                    {this.checkType(this.props.type, colSpan)}
                    {this.checkDate(this.props.date, colSpan)}
                    {this.checkLocation(this.props.location)}
                    {this.checkNumberAffected(this.props["number-affected"], colSpan)}
                </tbody>
            </Table>
        </div>
        
    );
  }
}

interface LocationAdvanced {
    'geonames-id': string;
    location: string;
    country: string;
    [key: string]: string;
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