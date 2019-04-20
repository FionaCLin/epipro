import React from 'react';
import '../css/Home.css';
import { LineChart, ResponsiveContainer, XAxis, YAxis, Line, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Frequency } from './Analytics';

const types: {[key: string]: string} = {
    WHO: "#19a022",
    Twitter: "#22d8d8",
    Google: "#a02f19"
}
export default class FrequencyFormat extends React.Component<IFrequencyFormatProps, IFrequencyFormatState> {
    constructor(props: IFrequencyFormatProps) {
        super(props);
    }

  render() {
    return (
        <div className='Frequency-chart'>
            <b>{this.props.title}</b>
            <ResponsiveContainer height="95%">
                <LineChart data={this.props.chartData}>
                    <XAxis label={{value: 'Dates', position: 'insideBottom', offset: -15}} dataKey="date"/>
                    <YAxis label={{value: 'Mentions count', position: 'insideLeft', angle: -90, offset: 0}} allowDecimals={false}/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend
                    layout="horizontal"
                    align="center"
                    wrapperStyle={{
                        paddingTop: "20px"
                    }}/>
                    {this.props.types.map((type: string, index: number) => {
                        return <Line key={index} type="monotone" dataKey={type} activeDot stroke={types[type]} />
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
  }
}

interface IFrequencyFormatProps {
    title: string;
    chartData?: Array<Frequency>;
    types: Array<string>;
}

interface IFrequencyFormatState {
}