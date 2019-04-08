import React from 'react';
import '../css/Home.css';
import { Button, Collapse } from 'react-bootstrap';
import GoogleCardList from './GoogleCardList';
import TweetList from './TweetList';
import GoogleData from '../dummydata/google_article.json';
import GoogleCard from './GoogleCard';

export default class MediaCoverage extends React.Component<IMediaCoverageProps, IMediaCoverageState> {
    constructor(props: IMediaCoverageProps) {
        super(props);
        this.state = {
            collapse: true
        }
    }

    static defaultProps = {
        googleData: GoogleData.articles,
        tweetData: [
            '1113518650747695106',
            '1115011387921707009',
            '1114987459446812673',
            '1114951144638439425',
            '1114966369823592448',
        ]
    }

    private toggleCollapse() {
      this.setState({
          collapse: !this.state.collapse
      });
    }

    render() {
      return (
            <div>
                <Button
                    onClick={() => this.toggleCollapse()}
                    aria-controls="media"
                    aria-expanded={this.state.collapse}
                    variant="secondary"
                    block
                >
                    Media Coverage
                </Button>
                <Collapse in={this.state.collapse}>
                    <div id="media" style={{height: '450px', margin: '10px'}}>
                        <GoogleCardList data={this.props.googleData}/>
                        <TweetList data={this.props.tweetData}/>
                    </div>
                </Collapse>
                <br></br>
            </div>
      );
    }
}

interface IMediaCoverageProps {
    googleData: Array<GoogleCard>;
    tweetData: Array<number>;
}

interface IMediaCoverageState {
    collapse: boolean;
}