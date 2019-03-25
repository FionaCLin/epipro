import React from 'react';
import '../css/Home.css';
import DatePicker from 'react-datepicker';
import { isNull } from 'util';

export default class TimeSearch extends React.Component<ITimeSearchProps, ITimeSearchState> {
  constructor(props: ITimeSearchProps) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      maxDate: new Date(),
      minDate: null
    }
  }
  
  private handleChange(event: Date | null, dateType: string) {
    let timeReturn: any = {};
    timeReturn[dateType] = event;
    console.log(event);
    this.setState(timeReturn);
    this.changeMinMaxDate(event, dateType);
    this.props.updateTime(timeReturn);
  }

  private changeMinMaxDate(newDate: Date | null, dateType: string) {
    let newMinMax: any = {
      minDate: null,
      maxDate: new Date()
    }

    if (!isNull(newDate)) {
      
      if (dateType == 'startDate') {
        newMinMax['minDate'] = newDate;
      } else {
        newMinMax['maxDate'] = newDate;
      }
    }

    this.setState(newMinMax);
  }

  render() {
    return (
      <div className="Filter-element">
        <div><b>Date Range</b></div>
          <div className="Filter-inline-1">
            <DatePicker
              selected={this.state.startDate}
              selectsStart
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              dateFormat="dd/MM/yyyy"
              minDate={this.state.minDate}
              maxDate={this.state.maxDate}
              onChange={(e:any) => this.handleChange(e, 'startDate')}
              placeholderText='Start Date'
            />
          </div>
          <div className='Time-between'>to</div>
          <div className="Filter-inline-2">
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            dateFormat="dd/MM/yyyy"
            minDate={this.state.minDate}
            maxDate={new Date()}
            onChange={(e:any) => this.handleChange(e, 'endDate')}
            placeholderText='End Date'
          />
        </div>
      </div>
    );
  }
}

interface ITimeSearchProps {
  updateTime: (event: object) => void;
}

interface ITimeSearchState {
  startDate: Date | null;
  endDate: Date | null;
  minDate: Date | null,
  maxDate: Date 
}