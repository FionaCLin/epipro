import React from 'react';
import '../css/Home.css';
import TweetListEmbed from 'react-tweet-embed';
import { Card, ListGroup } from 'react-bootstrap';
import TweetEmbed from 'react-tweet-embed';

export default class TweetList extends React.Component<ITweetListProps, ITweetListState> {
    constructor(props: ITweetListProps) {
        super(props);
    }

    static defaultProps = {
    }

  render() {
    return (
        <div style={{float: "left", height: '450px', width: '50%'}}>
            <Card style={{height:"100%"}}>
                <Card.Header as="h5">Tweets</Card.Header>
                <Card.Body style={{maxHeight: '425px', overflowY: 'auto'}}>
                    <ListGroup variant="flush">
                        {this.props.data.map((value: number) => {
                            return <ListGroup.Item style={{display: 'block', marginRight: 'auto', marginLeft: 'auto'}}>
                                <TweetEmbed id={value.toString()} placeholder={'loading'}/>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
  }
}

interface ITweetListProps {
    data: Array<number>;
}

interface ITweetListState {
}