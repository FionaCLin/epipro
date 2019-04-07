import React from 'react';
import '../css/Home.css';
import { LineChart, ResponsiveContainer, XAxis, YAxis, Line, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class FrequencyFormat extends React.Component<IFrequencyFormatProps, IFrequencyFormatState> {
    constructor(props: IFrequencyFormatProps) {
        super(props);
    }

  render() {
    return (
        <div className='Frequency-chart'>
            <b>WHO CHART</b>
            <ResponsiveContainer width = '100%' height = '90%' >
                <LineChart data={this.props.chartData}>
                    <XAxis dataKey="time"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    {this.props.types.map((type: string) => {
                        return <Line type="monotone" dataKey={type} stroke="#82ca9d" />
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
  }
}

interface IFrequencyFormatProps {
    chartData: Array<Plot>;
    types: Array<string>;
}

interface IFrequencyFormatState {
}

interface Plot {
    time: number;
    value: number;
}