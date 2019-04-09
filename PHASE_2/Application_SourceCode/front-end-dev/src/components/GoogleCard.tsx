import React from 'react';
import '../css/Home.css';
import { Card } from 'react-bootstrap';

export default class GoogleCard extends React.Component<IGoogleCardProps, IGoogleCardState> {
    constructor(props: IGoogleCardProps) {
        super(props);
    }

    trimText(main_text: string, minCut: number) {
        let cutCount: number = main_text.length;
    
        if (cutCount > minCut) {
          cutCount = minCut;
          while (cutCount < main_text.length && main_text.charAt(cutCount) != ' ') {
            cutCount++;
          }
        }
    
        return main_text.substring(0, cutCount);
    }

    render() {
        return (
            <a href={this.props.url} className="link" target="_blank">
            <Card className="Card-hover">
            <div style={{height: '200px', display: 'flex', borderColor: 'darkGray', border: '1px'}}>
                <img style={{float: 'left', objectFit: 'cover', height: '200px', width: '200px'}} src={this.props.urlToImage}/>
                <div style={{float: 'left', width: '100%', padding: '10px'}}>
                    <h5 style={{textDecoration: 'underline'}}>{ this.trimText(this.props.title, 50) }</h5>
                    <div style={{fontSize: 'small'}}>
                        <i>{ this.props.source.name } • { this.props.publishedAt }</i>
                        <p style={{marginTop: '5px'}}>{ this.trimText(this.props.description, 250) }...</p>
                    </div>
                </div>
            </div>
            </Card>
            </a>
        );
    }
}

interface IGoogleCardProps {
    title: string;
    description: string;
    publishedAt: string;
    source : { name: string };
    url: string;
    urlToImage: string;
}

interface IGoogleCardState {
}