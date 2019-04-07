import React from 'react';
import '../css/Home.css';

export default class MediaCoverage extends React.Component<IMediaCoverageProps, IMediaCoverageState> {
    constructor(props: IMediaCoverageProps) {
        super(props);
    }

    static defaultProps = {
    }

  render() {
    return (
        <div style={{height: '100vh', width: '100% '}}>
        </div>
    );
  }
}

interface IMediaCoverageProps {
}

interface IMediaCoverageState {
}