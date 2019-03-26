import React from 'react';
import '../css/Home.css';
import Report from './Report';
import { ListGroup } from 'react-bootstrap';
import { BackendAPI } from '../API'

let api = new BackendAPI();

export default class ReportList extends React.Component<IReportListProps, IReportListState>{
  constructor(props: IReportListProps) {
    super(props);
    console.log(this.props.reports);
  }
  
  render() {
    let reports;
    api.getAllReports((error: any, response: any) => {
      if (error) {
        if (error.response) {
          let message = error.response.data.message
          console.log(message, 'ppp');
        } else {
          console.log(error.message, 'ppp');
        }
      }
      reports = response;
      console.log(reports, 'reports in app tsx')
    });

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
