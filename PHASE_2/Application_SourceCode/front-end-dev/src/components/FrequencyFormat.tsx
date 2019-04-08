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
            <b>{this.props.title}</b>
            <ResponsiveContainer width = '100%' height = '90%' >
                <LineChart data={this.props.chartData}>
                    <XAxis label={{value: 'Dates', position: 'insideBottom', offset: 0}} dataKey="date"/>
                    <YAxis label={{value: 'Mentions count', position: 'insideLeft', angle: -90, offset: 25}}/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    {this.props.types.map((type: string) => {
                        return <Line type="monotone" dataKey={type} activeDot stroke="#82ca9d" />
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
  }
}

interface IFrequencyFormatProps {
    title: string;
    chartData?: Array<Plot>;
    types: Array<string>;
}

interface IFrequencyFormatState {
}

interface Plot {
    date: string;
    WHO: number;
    Twitter: number;
    Google: number;
}