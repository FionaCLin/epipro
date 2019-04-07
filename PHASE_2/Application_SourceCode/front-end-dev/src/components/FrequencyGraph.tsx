import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import FrequencyFormat from './FrequencyFormat';

const frequencyFilters: Array<string> = ['Day', 'Month', 'Year'];

export default class FrequencyGraph extends React.Component<IFrequencyGraphProps, IFrequencyGraphState> {
    constructor(props: IFrequencyGraphProps) {
        super(props);
        this.state = {
            collapse: true,
            frequencyFilter: frequencyFilters[0]
        };
    }

    private toggleCollapse() {
        this.setState({
            collapse: !this.state.collapse
        });
    }

    render() {
        const chartData = [
            { value: 14, plot: 20, time: 1503617297689 },
            { value: 15, plot: 16, time: 1503616882654 },
            { value: 20, plot: 14, time: 1503613184594 },
          ];
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
                    <div id="frequency" style={{height: '450px', margin: '10px'}}>
                        <FrequencyFormat types={['value', 'plot']} chartData={chartData}/>
                        <FrequencyFormat types={['value']} chartData={chartData}/>
                    </div>
                </Collapse>
                <br></br>
                <br></br>
            </div>
        );
    }
}

interface IFrequencyGraphProps {
    googleData?: Array<Frequency>;
    twitterData?: Array<Frequency>;
    whoData?: Array<Frequency>;
}

interface IFrequencyGraphState {
    collapse: boolean;
    frequencyFilter: string;
}

interface Frequency {
    date: string;
    count: number;
}