import React from 'react';
import '../css/Home.css';
import GoogleCard from './GoogleCard';
import { Card, ListGroup } from 'react-bootstrap';
import { reverse } from 'dns';

export default class GoogleCardList extends React.Component<IGoogleCardListProps, IGoogleCardListState> {
    constructor(props: IGoogleCardListProps) {
        super(props);
    }

  render() {
    let reverseSortData: Array<GoogleCard> = [];
    for (let i = this.props.data.length; i > 0; i--) reverseSortData.push(this.props.data[i - 1]);
    console.log(reverseSortData);
    return (
        <div style={{float: "left", height: '450px', width: '50%'}}>
            <Card style={{height:"100%"}}>
                <Card.Header as="h5">Google Articles and Headlines</Card.Header>
                <Card.Body style={{maxHeight: '425px', overflowY: 'auto'}}>
                    <ListGroup variant="flush">
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