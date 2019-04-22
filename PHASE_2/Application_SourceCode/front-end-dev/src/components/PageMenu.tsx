import React from 'react';
import '../css/Basic.css';
import frequency from '../imgs/frequency.png';
import heatmap from '../imgs/heatmap.png';
import event from '../imgs/event.png';
import media from '../imgs/media.png';
import trends from '../imgs/trends.png';
import { CardDeck, Card } from 'react-bootstrap';

export default class PageMenu extends React.Component<IPageMenuProps, IPageMenuState> {
    constructor(props: IPageMenuProps) {
        super(props);
    }

    render() {
        let cardStyle = { width: '300px', maxWidth: '300px', backgroundColor: 'darkslateblue', float: "left" as "left", color: 'white', margin: '5px', height: '370px'};
        return (
        <div style={{textAlign: 'center'}}>
            <h4>Report Features</h4>
            <div className="Page-menu">
                <CardDeck>
                    <Card style={cardStyle}>
                        <Card.Img variant="top" src={frequency} />
                        <Card.Body>
                            <Card.Title>Frequency Mentions</Card.Title>
                            <Card.Text>
                                Frequency graph of the number of mentions of the selected disease across the inputted time range.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    {this.props.type == 'trends' ? (
                    <div>
                        <Card style={cardStyle}>
                            <Card.Img variant="top" src={media} />                    
                            <Card.Body>
                                <Card.Title>Media Coverage</Card.Title>
                                <Card.Text>
                                    Headlines and tweets mentioning the selected disease.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={cardStyle}>
                            <Card.Img variant="top" src={trends} />                    
                            <Card.Body>
                                <Card.Title>Google Trends</Card.Title>
                                <Card.Text>
                                    Google search trends involving the selected disease.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div> ) : (
                    <div>
                        <Card style={cardStyle}>
                            <Card.Img variant="top" src={heatmap} />                    
                            <Card.Body>
                                <Card.Title>Heatmap</Card.Title>
                                <Card.Text>
                                    Shows the occurences of the selected disease within the geographical range.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={cardStyle}>
                            <Card.Img variant="top" src={event} />
                            <Card.Body>
                                <Card.Title>Event histogram</Card.Title>
                                <Card.Text>
                                    Histogram graph of the event types of the disease for WHO articles within inputted time range.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div> )}
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