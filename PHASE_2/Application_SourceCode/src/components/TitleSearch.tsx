import React from 'react';
import '../css/Home.css';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

export default class TitleSearch extends React.Component<ITitleSearchProps, ITitleSearchState> {
  constructor(props: ITitleSearchProps) {
        super(props);
        this.state = {
            title: this.props.title
        }
    }
    
    private handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        event.preventDefault();
        this.setState({title: event.target.value});
        this.props.updateTitle({title: event.target.value});
    }

    render() {
        return (
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Title search"
                    type="text"
                    onChange={(e: any) => this.handleChange(e)}
                    value={this.state.title}
                />
                <InputGroup.Append>
                    <Button onClick={this.props.onSearch}>Search</Button>
                </InputGroup.Append>
            </InputGroup>
        );
    }
}

interface ITitleSearchProps {
    title: string;
    updateTitle: (e: object) => void;
    onSearch: () => void;
}

interface ITitleSearchState {
    title: string;
}