import React from 'react';
import '../css/Home.css';
import Report from './Report';
import { ListGroup } from 'react-bootstrap';
import { BackendAPI } from '../API'

let api = new BackendAPI();

export default class ReportList extends React.Component<IReportListProps, IReportListState>{
  constructor(props: IReportListProps) {
    super(props);
  }
  
  render() {
    let reports;
    api.getAllReports((error: any, response: any) => {
        if (error) {
            if (error.response) {
                console.log('error message', error);
            } else {
                console.log('error message', error.message);
            }
        }
        reports = response;
    });

    return (
        <div>
            <h3>Disease Reports</h3>
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
