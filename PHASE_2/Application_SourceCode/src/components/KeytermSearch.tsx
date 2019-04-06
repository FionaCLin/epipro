import React from 'react';
import '../css/Home.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { string } from 'prop-types';
import { BackendAPI } from '../API'
import { makeCreatableSelect } from 'react-select/lib/Creatable';

let api = new BackendAPI();
const filterTypes: Array<any> = [
    { label: 'General', value: 0, type: 'general' },
    { label: 'Specific', value: 1, type: 'specific' }
];

export default class KeytermSearch extends React.Component<IKeytermSearchProps, IKeytermSearchState> {
    constructor(props: IKeytermSearchProps) {
        super(props);

        this.state = {
            filterType: 0,
            values: this.props.keyterms,
            filterOptions: [],
            keyterms: []
        }
    }

    componentWillMount() {
        this.addFilterOptions(filterTypes[1]);
        this.addFilterOptions(filterTypes[0]);
        this.changeType(filterTypes[0]);
    }

    private handleChange(event: Array<any>) {
        console.log(event);
        let values: Array<String> = event.map(option => (option.label));
        this.setState({ values });
        this.props.updateKeyterm(({ keyterms: values }));
    }

    private addFilterOptions(filterType: any) {
        api.getKeyTerms(filterType.type, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            }

            let newKeyterms: Array<any> = response.map((keyterm: any) => ({
                label: keyterm.name,
                value: keyterm.name,
                type: filterType.type
            }));

            this.setState({
                keyterms: this.state.keyterms.concat(newKeyterms),
                filterOptions: newKeyterms
            })
        });
    }

    private changeType(event: any) {
        this.setState({
            filterType: event.value,
            filterOptions: this.state.keyterms.filter((keyterm: any) => keyterm.type == event.type)
        });
    }

    render() {
        return (
            <div className="Filter-element">
                <b>Keyterms</b>
                <div className='Keyterm-flex'>
                    <div className='Keyterm-left'>
                        <Select
                            value={filterTypes.filter(type => type.value == this.state.filterType)}
                            options={filterTypes}
                            onChange={(e: any) => this.changeType(e)}
                        />
                    </div>
                    <div className='Keyterm-right'>
                        <CreatableSelect
                            isMulti
                            options={this.state.filterOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select keyterms..."
                            onChange={(e: any) => this.handleChange(e)}
                            value={this.state.values.map((value: String) => { return { label: value, value }})}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

interface IKeytermSearchProps {
    keyterms: Array<String>;
    updateKeyterm: (event: object) => void;
}

interface IKeytermSearchState {
    filterType: Number;
    values: Array<String>;
    filterOptions: Array<Object>;
    keyterms: Array<Object>
}
