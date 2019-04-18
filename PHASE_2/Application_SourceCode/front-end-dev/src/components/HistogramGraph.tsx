import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from 'recharts';
import { isNull } from 'util';

export default class HistogramGraph extends React.Component<IHistogramGraphProps, IHistogramGraphState> {
  constructor(props: IHistogramGraphProps) {
    super(props);
    this.state = {
      collapse: true
    };
  }

  private toggleCollapse() {
    this.setState({
        collapse: !this.state.collapse
    });
  }

  render() {
    return (
    <div>
      <Button
        onClick={() => this.toggleCollapse()}
        aria-controls="histogram"
        aria-expanded={this.state.collapse}
        variant="secondary"
        block
      >
        Event Histogram
      </Button>
      <Collapse in={this.state.collapse}>
        <div id="histogram">
            <div className="Analytics-collapse">
                <div className="Histogram-chart">
                    <b>Event frequency across {this.props.title.charAt(0).toUpperCase() + this.props.title.slice(1)}</b>
                    <ResponsiveContainer width = '100%' height = '100%' >
                        <BarChart data={!isNull(this.props.histogramData) ? this.props.histogramData.events : []}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis label={{value: 'Event types', position: 'insideBottom', offset: 0}} dataKey="event"/>
                        <YAxis label={{value: 'Event type count', position: 'insideLeft', angle: -90, offset: 0}}/>
                        <Tooltip/>
                        <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </Collapse>
      <br></br>
    </div>
    );
  }
}

interface IHistogramGraphProps {
  histogramData: any;
  title: string;
}

interface IHistogramGraphState {
  collapse: boolean;
}

export interface HistBar {
  event: string;
  count: number;
}