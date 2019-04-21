import React from 'react';
import '../css/Home.css';
import EventReport from './EventReport';
import { isNull } from 'util';
import { Badge } from 'react-bootstrap';
import EventReportList from './EventReportList';

export default class Report extends React.Component<IReportProps, IReportState> {
  constructor(props: IReportProps) {
    super(props);
  }
  
    private listCheck(check: Array<string>, type:string) {
      console.log(check);
        let listProp = null;
        if (!isNull(check) && check.length != 0) {
            if (!Array.isArray(check)) check = [check];
            listProp = check.map((item: string) => {
                return <Badge className="Badge-division" variant="secondary">{item}</Badge>
            });
            listProp = (<p><b>{type}:</b> {listProp}</p>);
        }
        return listProp;
    }

  private commentCheck(check: string) {
        return (
            (!isNull(check)) ? <p><b>Comments:</b> {check}</p> : null
        )
  }

  render() {
    let reported_events = (this.props.reported_events.length != 0) ?
        <EventReportList reports={this.props.reported_events}/> : null;

    return (
        <div>
            {this.listCheck(this.props.disease, 'Disease')}
            {this.listCheck(this.props.syndrome, 'Syndrome')}
            {reported_events}
            {this.commentCheck(this.props.comment)}
        </div>
    );
  }
}

interface IReportProps {
  disease: Array<string>;
  syndrome: Array<string>;
  reported_events: Array<EventReport>
  comment: string;
}

interface IReportState {    
}