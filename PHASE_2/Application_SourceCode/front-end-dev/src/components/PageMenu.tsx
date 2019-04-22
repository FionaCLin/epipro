import React from 'react';
import '../css/Home.css';
import frequency from '../imgs/loading1.gif';
import { CardDeck, Card } from 'react-bootstrap';

export default class PageMenu extends React.Component<IPageMenuProps, IPageMenuState> {
    constructor(props: IPageMenuProps) {
        super(props);
    }

    render() {
        let cardStyle = { width: '300px', backgroundColor: 'darkslateblue', float: "left" as "left", color: 'white', margin: '5px', padding: '5px'};
        return (
        <div style={{textAlign: 'center'}}>
            <h5>Report Features</h5>
            <div style={{marginLeft: 'auto', marginRight: 'auto', width: '930px'}}>
                <CardDeck>
                    <Card style={cardStyle}>
                        <Card.Body>
                            <Card.Img variant="top" src={frequency} />
                            <Card.Title>Frequency Mentions</Card.Title>
                            <Card.Text>
                                Frequency graph of the number of mentions of the selected disease across the inputted time range.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={cardStyle}>
                        <Card.Body>
                            <Card.Img variant="top" src="../imgs/heatmap.PNG" />
                            <Card.Title>Heatmap</Card.Title>
                            <Card.Text>
                                Shows the occurences of the selected disease within the geographical range.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={cardStyle}>
                        <Card.Body>
                            <Card.Img variant="top" src="../imgs/event.PNG" />
                            <Card.Title>Event histogram</Card.Title>
                            <Card.Text>
                                Histogram graph of the event types of the disease for WHO articles within inputted time range.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </CardDeck>
            </div>
        </div>
        );
    }
}

interface IPageMenuProps {
    type: string;
}

interface IPageMenuState {
}