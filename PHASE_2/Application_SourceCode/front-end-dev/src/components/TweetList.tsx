import React from 'react';
import '../css/Home.css';
import { Card, ListGroup } from 'react-bootstrap';
import TweetEmbed from 'react-tweet-embed';

export default class TweetList extends React.Component<ITweetListProps, ITweetListState> {
    constructor(props: ITweetListProps) {
        super(props);
    }

    render() {
        console.log(this.props.data);
        return (
            <div style={{float: "left", height: '700px', width: '50%'}}>
                <Card style={{height:"100%"}}>
                    <Card.Header as="h5">Tweets</Card.Header>
                    <Card.Body style={{maxHeight: '725px', overflowY: 'auto'}}>
                        <ListGroup variant="flush" style={{marginTop: '-10px', marginBottom: '-10px'}}>
                            {this.props.data.length == 0 ? 'No results found.' : <div></div>}
                            {this.props.data.map((value: string, index: number) => {
                                return <ListGroup.Item key={index} style={{display: 'block', marginRight: 'auto', marginLeft: 'auto'}}>
                                    <TweetEmbed id={value} placeholder={'loading'}/>
                                </ListGroup.Item>
                            })}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export function filterByLocation(tweets: Array<any>, locations: Array<string>) {
    let filtered = tweets.map(value => value);
    if (locations.length != 0) {
        for (let i = 0; i < locations.length; i++) {
            let multiLocation = locations[i].indexOf(',');
            let location = locations[i];
            if (multiLocation != -1) location = location.substring(0, multiLocation);
            filtered = filtered.filter(value => (value.text.indexOf(location) != -1));
        }
    }
    return filtered;
}

interface ITweetListProps {
    data: Array<string>;
}

interface ITweetListState {
}