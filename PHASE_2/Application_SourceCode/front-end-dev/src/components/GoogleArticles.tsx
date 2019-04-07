import React from 'react';
import '../css/Home.css';

export default class GoogleArticles extends React.Component<IGoogleArticlesProps, IGoogleArticlesState> {
    constructor(props: IGoogleArticlesProps) {
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

interface IGoogleArticlesProps {
}

interface IGoogleArticlesState {
}