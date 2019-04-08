import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from 'recharts';

export default class HistogramGraph extends React.Component<IHistogramGraphProps, IHistogramGraphState> {
  constructor(props: IHistogramGraphProps) {
    super(props);
    this.state = {
      collapse: true
    };
  }

  static defaultProps = {
    histogramData: [
      { event:'presence', count: 12 },
      { event: 'death', count: 0 },
      { event: 'infected', count: 30 },
      { event: 'hospitalised', count: 43 },
      { event: 'recovered', count: 21 }
    ]
  };

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
        <div id="histogram" style={{height: '450px', margin: '10px'}}>
          <div className="Histogram-chart">
          <b>{this.props.title}</b>
          <ResponsiveContainer width = '100%' height = '100%' >
            <BarChart data={this.props.histogramData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis label={{value: 'Event types', position: 'insideBottom', offset: 0}} dataKey="event"/>
              <YAxis label={{value: 'Event type count', position: 'insideLeft', angle: -90, offset: 25}}/>
              <Tooltip/>
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </Collapse>
      <br></br>
    </div>
    );
  }
}

interface IHistogramGraphProps {
  histogramData?: Array<HistBar>;
  title: string;
}

interface IHistogramGraphState {
  collapse: boolean;
}

interface HistBar {
  event: string;
  count: number;
}