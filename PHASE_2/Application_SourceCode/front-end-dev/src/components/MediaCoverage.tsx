import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import GoogleCardList from './GoogleCardList';
import TweetList from './TweetList';
import GoogleData from '../dummydata/google_article.json';
import GoogleCard from './GoogleCard';
import { Tooltip } from './Tooltip';

export default class MediaCoverage extends React.Component<IMediaCoverageProps, IMediaCoverageState> {
    constructor(props: IMediaCoverageProps) {
        super(props);
        this.state = {
            collapse: true
        }
    }

    render() {
      return (
            <div>
                <p className="Section-title">
                    <b>Media coverage of {this.props.title}</b>
                    <Tooltip description={`Media coverage of the disease from Twitter and Google News within the time range.`} />
                </p>
                <GoogleCardList data={this.props.googleData}/>
                <TweetList data={this.props.tweetData}/>
            </div>
      );
    }
}

interface IMediaCoverageProps {
    googleData: Array<GoogleCard>;
    tweetData: Array<string>;
    title: string;
}

interface IMediaCoverageState {
}