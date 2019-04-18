import React from 'react';
import '../css/Home.css';
import { isNull, isNullOrUndefined } from 'util';
import HeatMap from './Heatmap';
import FrequencyGraph from './FrequencyGraph';
import HistogramGraph from './HistogramGraph';
import { IApiState } from './Analytics';

export default class AnalyticsReport extends React.Component<IAnalyticsReportProps, IAnalyticsReportState> {
  constructor(props: IAnalyticsReportProps) {
    super(props);
    this.state = {
        frequencyData: undefined,
        histogramData: undefined,
        heatMapData: undefined,
        prevState: undefined
    };
    this.handleChange = this.handleChange.bind(this);
    this.checkApiState = this.checkApiState.bind(this);
  }

    private handleChange(event: any) {
        console.log(event);
        this.setState(event);
    }

    private stringifyDates(date: Date | null, dateType: string) {
        let temp = (!isNull(date)) ? new Date(date) : date;
        if (!isNull(temp)) {
            if (dateType == 'endDate') {
                temp.setSeconds(temp.getSeconds() - 1);
                temp.setDate(temp.getDate() + 1);
            }
            temp = new Date(temp.getTime() - (temp.getTimezoneOffset() * 60000));
        }
        return (!isNull(temp) ? temp.toISOString().slice(0, -5) : '');
    }

    private createFrequencyData(apiFrequency: Array<APIFrequency>) {
        if (!isNull(apiFrequency)) {
            console.log("INSIDE", apiFrequency);
            let count = (!isNull(this.props.startDate)) ? new Date(this.props.startDate) : new Date(2017, 0, 1);
            let endDate = (!isNull(this.props.endDate)) ? new Date(this.props.endDate) : new Date();
            endDate.setHours(0, 0, 0, 0);

            let countStr: string = this.stringifyDates(count, 'startDate');
            let endStr: string = this.stringifyDates(endDate, 'endDate');
            countStr =  countStr.substring(0, countStr.indexOf('T'));
            endStr = endStr.substring(0, endStr.indexOf('T'));

            let dateArray: Array<Frequency> = [];
            let temp: Frequency = { date: countStr, WHO: 0, Google: 0, Twitter: 0 };

            while (count <= endDate) {
                temp = { date: countStr, WHO: 0, Google: 0, Twitter: 0 };
                dateArray.push(temp);
                let sameDate = apiFrequency.filter(value => value.date == countStr);
                if (sameDate.length != 0) temp.WHO = sameDate[0].count;
                count.setDate(count.getDate() + 1);
                count.setHours(0, 0, 0, 0);
                countStr =  this.stringifyDates(count, 'startDate').substring(0, countStr.indexOf('T'));
            }
            console.log('date', dateArray);
            return dateArray;
        }
    }

    private checkApiState() {
        if (!isNullOrUndefined(this.props.apiState)) {
            console.log("TRIGGER")
            let frequencyData = this.createFrequencyData(this.props.apiState.frequency_graph);
            this.setState({
                frequencyData,
                heatMapData: this.props.apiState.heat_map,
                histogramData: this.props.apiState.event_graph
            });
        }
    }

    render() {
        this.checkApiState();
        return (
            <div>
                <FrequencyGraph frequencyData={this.state.frequencyData}/>
                {/* <HeatMap heatMapData={this.state.heatMapData}/> */}
                <HistogramGraph title='' histogramData={this.state.histogramData}/>
            </div>
        );
    }
}

interface IAnalyticsReportProps {
    startDate: Date | null;
    endDate: Date | null;
    apiState: null | undefined | IApiState;
}

interface IAnalyticsReportState {
    prevState: undefined | IApiState;
    frequencyData: any;
    heatMapData: undefined | Array<Frequency>;
    histogramData: any;
}

export interface Frequency {
    date: string;
    WHO: number;
    Twitter: number;
    Google: number;
}

interface APIFrequency {
    date: string,
    count: number
}