import React from 'react';
import '../css/Home.css';

export default class Marker extends React.Component<IMarkerProps, IMarkerState> {
    constructor(props: IMarkerProps) {
        super(props);
        this.state = {
            collapse: true
        };
    }

  render() {
      const checkHover = this.props.$hover;
        return (
            <div>
                { checkHover ? (
                <div className="Marker">
                    <div>
                        <b>Location:</b> {this.props.location}<br/>
                        <b>Number affected:</b> {this.props.number_affected}<br/>
                        <b>Article mentions:</b> {this.props.article_count}<br/>
                    </div>
                </div>
                ) : (<div></div>)}
            </div>
        );
    }
}

interface IMarkerProps {
    $hover?: boolean;
    lat: number;
    lng: number;
    location: string;
    number_affected: number;
    article_count: number;
}

interface IMarkerState {
    collapse: boolean;
}