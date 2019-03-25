import React from 'react';
import '../css/Home.css';
import Report from './Report';
import { ListGroup } from 'react-bootstrap';

export default class ReportList extends React.Component<IReportListProps, IReportListState>{
  constructor(props: IReportListProps) {
    super(props);
    console.log(this.props.reports);
  }
  
  render() {
    return (
        <div className="ReportList-division">
            <h3>Reports</h3>
            <ListGroup>
                {this.props.reports.map((report: any) => {
                    return <ListGroup.Item>
                        <Report {...report} />
                    </ListGroup.Item>
                })}
            </ListGroup>
        </div>
    );
  }
}

interface IReportListProps {
  reports: Array<Report>;
}

interface IReportListState {    
}