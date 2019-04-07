import React from 'react';
import '../css/Home.css';

export default class Tweets extends React.Component<ITweetsProps, ITweetsState> {
    constructor(props: ITweetsProps) {
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

interface ITweetsProps {
}

interface ITweetsState {
}