import React from 'react';
import '../css/Home.css';
import Report from './Report';
import ReportList from './ReportList';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Header from './Header';
import { isNullOrUndefined } from 'util';

export default class Article extends React.Component<IArticleProps, IArticleState>{
    constructor(props: IArticleProps) {
        super(props);
    }

    componentWillMount() {
        this.setState(this.props.location.state);
    }

    private renderRedirect() {
        if (isNullOrUndefined(this.state)) return true;
        return false;
    }
    
    render() {
        return (
            <div>
                {this.renderRedirect() ? <Redirect to='/' /> :
                <div className="bg">
                    <Header />
                    <body id="top">
                        <div className="Main">
                            <Link to='/search'><Button variant="secondary">Back to Search</Button></Link>
                            <br /><br />
                            <h1>{this.state.headline}</h1>
                            <p><i>URL: <a href={this.state.url} target="_blank">{this.state.url}</a></i></p>
                            <p><i>DOP: {this.state.date_of_publication}</i></p>
                            <p>{this.state.main_text}</p>
                            <ReportList reports={this.state.reports} />
                        </div>
                    </body>
                </div>
                }
            </div>
        );
    }
}

interface IArticleProps {
    location: {state: IArticleState};
}

export interface IArticleState {
    url: string;
    date_of_publication: string;
    headline: string;
    main_text: string;
    reports: Array<Report>;   
}