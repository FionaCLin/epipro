import React from 'react';
import '../css/Home.css';
import { Button, Collapse, InputGroup, ButtonGroup, ToggleButton } from 'react-bootstrap';
import FrequencyFormat from './FrequencyFormat';
import { isUndefined } from 'util';

const frequencyFilters: Array<string> = ['day', 'month', 'year'];

export default class FrequencyGraph extends React.Component<IFrequencyGraphProps, IFrequencyGraphState> {
    constructor(props: IFrequencyGraphProps) {
        super(props);
        this.state = {
            collapse: true,
            frequencyFilter: frequencyFilters[0],
            frequencyData: (!isUndefined(this.props.chartData)) ? this.props.chartData : []
        };
    }

    static defaultProps = {
        chartData: [
            { WHO: 1, Twitter: 2, Google: 3, date: "2017-02-25Txx:xx:xx" },
            { WHO: 2, Twitter: 3, Google: 4, date: "2017-02-26Txx:xx:xx" },
            { WHO: 3, Twitter: 4, Google: 5, date: "2017-02-27Txx:xx:xx" },
            { WHO: 4, Twitter: 5, Google: 6, date: "2017-02-28Txx:xx:xx" },
            { WHO: 5, Twitter: 6, Google: 7, date: "2017-03-01Txx:xx:xx" },
            { WHO: 6, Twitter: 7, Google: 8, date: "2017-03-02Txx:xx:xx" }
        ]
    }

    private toggleCollapse() {
        this.setState({
            collapse: !this.state.collapse
        });
    }

    private convertFrequency(interval: string) {
        let data = this.props.chartData;
        if (!isUndefined(data) && this.state.frequencyFilter != interval) {
            if (interval == 'day') {
                this.setState({frequencyData: data, frequencyFilter: interval});
            } else {
                let start_date = new Date(data[0].date.replace(/x/g, '0'));
                let end_date= new Date(data[data.length - 1].date.replace(/x/g, '0'));

                let newFrequency: Array<Frequency> = [];
                let counterDate = new Date(start_date.getFullYear(), start_date.getMonth(), 1);
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

    formatXAxis(date: string) {
        let newDate: string = date;
        if (date.indexOf('T') != -1) newDate = newDate.substring(0, date.indexOf('T'));
        newDate = newDate.split('-').reverse().join('/');
        return newDate;
    }

    private cleanChartData(data?: Array<Frequency>) {
        if (!isUndefined(data)) {
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
            <div>
                <Button
                    onClick={() => this.toggleCollapse()}
                    aria-controls="frequency"
                    aria-expanded={this.state.collapse}
                    variant="secondary"
                    block
                >
                    Frequency Mentions
                </Button>
                <Collapse in={this.state.collapse}>
                    <div id="frequency">
                        <div className="Analytics-collapse">
                            <FrequencyFormat title='Frequency of Zika mentions on articles at WHO' types={['WHO']} chartData={this.cleanChartData(this.state.frequencyData)}/>
                            <FrequencyFormat title='Frequency of Zika mentions on different media coverage' types={['Twitter', 'Google']} chartData={this.cleanChartData(this.state.frequencyData)}/>
                            <div style={{float: 'left', marginRight: '10px'}}>Date frequency:</div>
                            <input type="radio" onClick={() => this.convertFrequency(frequencyFilters[0])} name="frequencyFilter" defaultChecked/>Day
                            <input style={{marginLeft: '10px'}} type="radio" onClick={() => this.convertFrequency(frequencyFilters[1])} name="frequencyFilter" />Month
                            <input style={{marginLeft: '10px'}} type="radio" onClick={() => this.convertFrequency(frequencyFilters[2])} name="frequencyFilter" />Year
                        </div>
                    </div>
                </Collapse>
                <br></br>
            </div>
        );
    }
}

interface IFrequencyGraphProps {
    chartData?: Array<Frequency>;
}

interface IFrequencyGraphState {
    collapse: boolean;
    frequencyFilter: string;
    frequencyData: Array<Frequency>;
}

interface Frequency {
    date: string;
    WHO: number;
    Twitter: number;
    Google: number;
}