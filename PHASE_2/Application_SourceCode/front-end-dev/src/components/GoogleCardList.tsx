import React from 'react';
import '../css/Home.css';
import GoogleCard from './GoogleCard';
import { Card, ListGroup } from 'react-bootstrap';

export default class GoogleCardList extends React.Component<IGoogleCardListProps, IGoogleCardListState> {
    constructor(props: IGoogleCardListProps) {
        super(props);
    }

  render() {
      console.log(this.props.data);
    return (
        <div style={{float: "left", height: '450px', width: '50%'}}>
            <Card style={{height:"100%"}}>
                <Card.Header as="h5">Google Articles and Headlines</Card.Header>
                <Card.Body style={{maxHeight: '425px', overflowY: 'auto'}}>
                    <ListGroup variant="flush">
                        {this.props.data.map((value: any) => {
                            return <ListGroup.Item style={{display: 'block', marginRight: 'auto', marginLeft: 'auto'}}>
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