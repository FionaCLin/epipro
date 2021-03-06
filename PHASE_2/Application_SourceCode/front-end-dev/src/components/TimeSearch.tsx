import React from 'react';
import '../css/Basic.css';
import DatePicker from 'react-datepicker';
import { isNull, isUndefined } from 'util';

export default class TimeSearch extends React.Component<ITimeSearchProps, ITimeSearchState> {
    constructor(props: ITimeSearchProps) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            maxDate: new Date(),
            minDate: (!isUndefined(this.props.minDate)) ? this.props.minDate : null
        }
        if (!isNull(this.state.startDate)) this.changeMinMaxDate(this.state.startDate, 'startDate');
        if (!isNull(this.state.endDate)) this.changeMinMaxDate(this.state.endDate, 'endDate');
    }
    
    private handleChange(event: Date | null, dateType: string) {
        let timeState: any = {};
        timeState[dateType] = event;
        this.setState(timeState);
        this.changeMinMaxDate(event, dateType);
        this.props.updateTime(timeState);
    }

    private changeMinMaxDate(newDate: Date | null, dateType: string) {
        let newMinMax: any = {
        minDate: null,
        maxDate: new Date()
        }

        if (!isNull(newDate)) {
            if (dateType == 'startDate') newMinMax['minDate'] = newDate;
            else newMinMax['maxDate'] = newDate;
        }

        this.setState(newMinMax);
    }

    render() {
        return (
        <div style={{float: 'left'}}>
            <div className="Date-picker">
                <DatePicker
                selected={this.state.startDate}
                selectsStart
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                dateFormat="dd/MM/yyyy"
                minDate={this.props.minDate}
                maxDate={this.state.maxDate}
                onChange={(e:any) => this.handleChange(e, 'startDate')}
                placeholderText='Start Date'
                />
            </div>
            <div className="Date-picker">
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
    startDate: Date | null;
    endDate: Date | null;
    minDate?: Date;
}

interface ITimeSearchState {
    startDate: Date | null;
    endDate: Date | null;
    minDate: Date | null,
    maxDate: Date 
}
