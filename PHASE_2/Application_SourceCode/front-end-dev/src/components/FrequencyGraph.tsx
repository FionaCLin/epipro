import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import FrequencyFormat from './FrequencyFormat';
import { isUndefined, isNullOrUndefined } from 'util';
import { Frequency } from './Analytics';

const frequencyFilters: Array<string> = ['day', 'month', 'year'];

export default class FrequencyGraph extends React.Component<IFrequencyGraphProps, IFrequencyGraphState> {
    constructor(props: IFrequencyGraphProps) {
        super(props);
        this.state = {
            frequencyFilter: frequencyFilters[0],
            frequencyData: (!isUndefined(this.props.frequencyData)) ? this.props.frequencyData : []
        };
    }

    componentWillReceiveProps(newProps: any) {
        if (!isNullOrUndefined(newProps.frequencyData) && newProps.frequencyData !== this.state.frequencyData) {
            this.setState({frequencyData: newProps.frequencyData});
        }
    }

    private convertFrequency(interval: string) {
        let data = this.props.frequencyData;
        if (!isUndefined(data) && this.state.frequencyFilter != interval) {
            console.log("HERE");
            if (interval == 'day') {
                this.setState({frequencyData: data, frequencyFilter: interval});
            } else {
                let start_date = new Date(data[0].date.replace(/x/g, '0'));
                let end_date= new Date(data[data.length - 1].date.replace(/x/g, '0'));

                let newFrequency: Array<Frequency> = [];
                let counterDate = new Date(start_date.getFullYear(), start_date.getMonth(), 1);
                if (interval == 'year') counterDate.setMonth(0);
                while(counterDate <= end_date) {
                    let countStr = new Date(counterDate.getTime() - counterDate.getTimezoneOffset() * 60000).toISOString();
                    data.forEach((date: Frequency, i: number) => {
                        let countInd = (interval == 'month') ? countStr.indexOf('-', countStr.indexOf('-') + 1) : countStr.indexOf('-');
                        let countInterval = countStr.substring(0, countInd);
                        if (date.date.indexOf(countInterval) !== -1) {
                            let found = newFrequency.filter(e => e.date == countInterval);
                            if (found.length == 0) {
                                newFrequency.push({
                                    date: countInterval,
                                    WHO: date.WHO,
                                    Twitter: date.Twitter,
                                    Google: date.Google
                                });
                            } else {
                                let num = newFrequency.indexOf(found[0]);
                                newFrequency[num] = {
                                    date: newFrequency[num].date,
                                    WHO: newFrequency[num].WHO + date.WHO,
                                    Google: newFrequency[num].Google + date.Google,
                                    Twitter: newFrequency[num].Twitter + date.Twitter
                                }
                            }
                        }
                    });
                    if (interval == 'month') counterDate.setMonth(counterDate.getMonth() + 1);
                    else counterDate.setFullYear(counterDate.getFullYear() + 1);
                }

                this.setState({frequencyData: newFrequency, frequencyFilter: interval});
                console.log(newFrequency);
            }
        }
    }

    private formatXAxis(date: string) {
        let newDate: string = date;
        if (date.indexOf('T') != -1) newDate = newDate.substring(0, date.indexOf('T'));
        newDate = newDate.split('-').reverse().join('/');
        return newDate;
    }

    private cleanChartData(data?: Array<Frequency>) {
        if (!isNullOrUndefined(data)) {
            return data.map((value: Frequency) => {
                return {
                    WHO: value.WHO,
                    Twitter: value.Twitter,
                    Google: value.Google,
                    date: this.formatXAxis(value.date)
                }
            });
        }
    }

    render() {
        return (
            <div id="frequency">
                <FrequencyFormat
                    title={'Frequency of ' + this.props.title.charAt(0).toUpperCase() + this.props.title.slice(1) + ' mentions on ' + this.props.titleType}
                    types={this.props.types}
                    chartData={this.cleanChartData(this.state.frequencyData)}/>
                <br></br>
                <br></br>
                <div>
                    <div style={{float: 'left', marginRight: '10px'}}>Date frequency:</div>
                    <input type="radio" onClick={() => this.convertFrequency(frequencyFilters[0])} name="frequencyFilter" defaultChecked/>Day
                    <input style={{marginLeft: '10px'}} type="radio" onClick={() => this.convertFrequency(frequencyFilters[1])} name="frequencyFilter" />Month
                    <input style={{marginLeft: '10px'}} type="radio" onClick={() => this.convertFrequency(frequencyFilters[2])} name="frequencyFilter" />Year
                </div>
            </div>
        );
    }
}

interface IFrequencyGraphProps {
    frequencyData: any;
    title: string;
    titleType: string;
    types: Array<string>;
}

interface IFrequencyGraphState {
    frequencyFilter: string;
    frequencyData: Array<Frequency>;
}