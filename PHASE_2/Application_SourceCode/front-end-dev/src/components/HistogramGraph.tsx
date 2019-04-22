import React from 'react';
import '../css/Analytics.css';
import { Tooltip as ChartTooltip } from './Tooltip';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from 'recharts';
import { isUndefined, isNullOrUndefined } from 'util';
import { capitalize } from './util';

export default class HistogramGraph extends React.Component<IHistogramGraphProps, IHistogramGraphState> {
    constructor(props: IHistogramGraphProps) {
        super(props);
    }

    private createGraphRange() {
        let graphRange = '';
        if (!isNullOrUndefined(this.props.histogramData) &&
            !isNullOrUndefined(this.props.histogramData.startDate) &&
            !isNullOrUndefined(this.props.histogramData.endDate)) {
            let startDate = this.props.histogramData.startDate.split('-').reverse().join('/');
            let endDate = this.props.histogramData.endDate.split('-').reverse().join('/');
            graphRange = 'from ' + startDate + ' to ' + endDate;
        }
        return graphRange;
    }

    render() {
        let graphRange = this.createGraphRange();
        return (
            <div id="histogram">
                <div className="Histogram-chart">
                    <p>
                        <b>Event histogram of {capitalize(this.props.title)} {graphRange}</b>
                        <ChartTooltip description={`Overview of events across articles with a publication date within the inputted time range.
                                                    The title range is the date range across the selected articles.`} />
                    </p>
                    <ResponsiveContainer width = '100%' height = '100%' >
                        <BarChart data={!isNullOrUndefined(this.props.histogramData) && !isUndefined(this.props.histogramData.events) ?
                                        this.props.histogramData.events : []}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis label={{value: 'Event types', position: 'insideBottom', offset: -15}} dataKey="event"/>
                        <YAxis label={{value: 'Event type count', position: 'insideLeft', angle: -90, offset: 0}}/>
                        <Tooltip/>
                        <Bar dataKey="count" fill="#8884d8" />
                        <Legend
                        layout="horizontal"
                        align="center"
                        wrapperStyle={{
                            paddingTop: "20px"
                        }}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
}

interface IHistogramGraphProps {
  histogramData: HistogramData | null | undefined;
  title: string;
}

interface IHistogramGraphState {
}

export interface HistBar {
  event: string;
  count: number;
}

export interface APIEvent {
    start_date: string;
    end_date: string;
    death: number;
    hospitalised: number;
    infected: number;
    presence: number;
    recovered: number;
    [key: string]: string | number;
}

export interface HistogramData {
    startDate: string;
    endDate: string;
    events: Array<HistBar>;
}