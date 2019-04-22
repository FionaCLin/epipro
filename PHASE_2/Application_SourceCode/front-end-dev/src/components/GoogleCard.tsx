import React from 'react';
import '../css/Basic.css';
import '../css/Trends.css';
import { Card } from 'react-bootstrap';
import { isNull } from 'util';

export default class GoogleCard extends React.Component<IGoogleCardProps, IGoogleCardState> {
    constructor(props: IGoogleCardProps) {
        super(props);
    }

    private trimText(main_text: string, minCut: number) {
        if (isNull(main_text)) return 'No description found.';
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
            <div className="Google-card">
                {!isNull(this.props.urlToImage) ? (
                    <div style={{width: '200px'}}>
                    <img className="Google-card-image" src={this.props.urlToImage}/>
                    </div>
                ) : ( <div></div> )}
                <div className="Google-card-text">
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