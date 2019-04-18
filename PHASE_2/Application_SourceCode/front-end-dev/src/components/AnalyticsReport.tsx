import React from 'react';
import '../css/Home.css';
import { isNull, isNullOrUndefined, isUndefined } from 'util';
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
        prevState: false
    };
    this.handleChange = this.handleChange.bind(this);
    // this.checkApiState = this.checkApiState.bind(this);
  }

    private handleChange(event: any) {
        console.log(event);
        this.setState(event);
    }

    render() {
        console.log(this.props.frequencyData);
        return (
            <div>
                <FrequencyGraph frequencyData={this.props.frequencyData}/>
                {/* <HeatMap heatMapData={this.state.heatMapData}/> */}
                {/* <HistogramGraph title='' histogramData={this.state.histogramData}/> */}
            </div>
        );
    }
}

interface IAnalyticsReportProps {
    frequencyData: any;
}

interface IAnalyticsReportState {
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