import React from 'react';
import '../css/Trends.css';
import GoogleCard from './GoogleCard';
import { Card, ListGroup } from 'react-bootstrap';

export default class GoogleCardList extends React.Component<IGoogleCardListProps, IGoogleCardListState> {
    constructor(props: IGoogleCardListProps) {
        super(props);
    }

    render() {
        let reverseSortData: Array<GoogleCard> = [];
        for (let i = this.props.data.length; i > 0; i--) reverseSortData.push(this.props.data[i - 1]);
        return (
            <div className="Media-list">
                <Card style={{height:"100%"}}>
                    <Card.Header as="h5">Google Articles and Headlines</Card.Header>
                    <Card.Body style={{maxHeight: '725px', overflowY: 'auto'}}>
                        <ListGroup variant="flush">
                            {reverseSortData.length == 0 ? 'No results found.' : <div></div>}
                            {reverseSortData.map((value: any, index: number) => {
                                return <ListGroup.Item key={index} style={{display: 'block', marginRight: 'auto', marginLeft: 'auto'}}>
                                    <GoogleCard {...value}/>
                                </ListGroup.Item>
                            })}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

interface IGoogleCardListProps {
    data: Array<GoogleCard>;
}

interface IGoogleCardListState {
}