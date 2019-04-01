import React from 'react';
import '../css/Home.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { string } from 'prop-types';
import { BackendAPI } from '../API'
import { makeCreatableSelect } from 'react-select/lib/Creatable';

let api = new BackendAPI();

export default class KeytermSearch extends React.Component<IKeytermSearchProps, IKeytermSearchState> {
    constructor(props: IKeytermSearchProps) {
        super(props);

        this.state = {
            filterType: 0,
            values: [],
            filterOptions: [],
            keyterms: []
        }
    }

    componentWillMount() {
        api.getKeyTerms('general', (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            }
            let keyterms: Array<any> = response.map((keyterm: any, index: number) => ({
                label: keyterm.name,
                value: index,
                type: keyterm.type
            }))
            this.setState({
                filterType: 0,
                values: [],
                filterOptions: keyterms,
                keyterms
            })
        });
    }


    private handleChange(event: Array<any>) {
        let values: Array<Number> = event.map(option => (option.value));
        this.setState({ values });
        this.props.updateKeyterm(({ keyterms: values }));
    }

    private changeType(event: any, filterTypes: Array<any>) {
        api.getKeyTerms(event.type, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            }

            let keyterms: Array<any> = response.map((keyterm: any, index: number) => ({
                label: keyterm.name,
                value: index,
                type: keyterm.type
            }))
            this.setState({
                filterType: event.value,
                values: [],
                filterOptions: keyterms,
                keyterms
            })
            console.log(keyterms, `${event.type} key term in keyterm search tsx`)
        });
    }

    render() {

        let filterTypes: Array<any> = [
            { label: 'General', value: 0, type: 'general' },
            { label: 'Specific', value: 1, type: 'specific' }
        ]
        return (
            <div className="Filter-element">
                <b>Keyterms</b>
                <div className='Keyterm-flex'>
                    <div className='Keyterm-left'>
                        <Select
                            value={filterTypes.filter(type => type.value == this.state.filterType)}
                            options={filterTypes}
                            onChange={(e: any) => this.changeType(e, filterTypes)}
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
                        />
                    </div>
                </div>
            </div>
        );
    }
}

interface IKeytermSearchProps {
    updateKeyterm: (event: object) => void;
}

interface IKeytermSearchState {
    filterType: Number;
    values: Array<Number>;
    filterOptions: Array<Object>;
    keyterms: Array<any>;
}
