import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from 'recharts';
import { isNull, isUndefined, isNullOrUndefined } from 'util';

export default class HistogramGraph extends React.Component<IHistogramGraphProps, IHistogramGraphState> {
  constructor(props: IHistogramGraphProps) {
    super(props);
  }

  render() {
    return (
        <div id="histogram">
            <div className="Histogram-chart">
                <b>Event frequency across {this.props.title.charAt(0).toUpperCase() + this.props.title.slice(1)}</b>
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
  histogramData: any;
  title: string;
}

interface IHistogramGraphState {
}

export interface HistBar {
  event: string;
  count: number;
}