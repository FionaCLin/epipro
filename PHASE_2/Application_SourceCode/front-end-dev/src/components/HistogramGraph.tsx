import React from 'react';
import '../css/Home.css';

export default class HistogramGraph extends React.Component<IHistogramGraphProps, IHistogramGraphState> {
    constructor(props: IHistogramGraphProps) {
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

interface IHistogramGraphProps {
}

interface IHistogramGraphState {
}