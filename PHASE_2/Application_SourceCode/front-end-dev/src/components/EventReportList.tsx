import React from 'react';
import '../css/Search.css';
import EventReport from './EventReport';
import { Card } from 'react-bootstrap';

export default class EventReportList extends React.Component<IEventReportListProps, IEventReportListState>{
    constructor(props: IEventReportListProps) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <p><b>Event Reports:</b></p>
                {this.props.reports.map((report: any) => {
                    return <div className="EventReport-division">
                        <Card>
                            <Card.Body className="EventReport-card">
                                <EventReport {...report} />
                            </Card.Body>
                        </Card>
                    </div>
                })}
            </div>
        );
    }
}

interface IEventReportListProps {
    reports: Array<EventReport>;
}

interface IEventReportListState {    
}