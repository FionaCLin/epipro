import React from 'react';
import '../css/Search.css';
import '../css/Basic.css';
import CreatableSelect from 'react-select/lib/Creatable';
import { BackendAPI } from '../API'

let api = new BackendAPI();
const filterTypes: Array<any> = ['general', 'specific'];

export default class KeytermSearch extends React.Component<IKeytermSearchProps, IKeytermSearchState> {
    constructor(props: IKeytermSearchProps) {
        super(props);

        this.state = {
            values: this.props.keyterms,
            filterOptions: [],
        }
    }

    componentWillMount() {
        this.addFilterOptions(filterTypes[1]);
        this.addFilterOptions(filterTypes[0]);
    }

    private handleChange(event: Array<any>) {
        console.log(event);
        let values: Array<String> = event.map(option => (option.label));
        this.setState({ values });
        this.props.updateKeyterm(({ keyterms: values }));
    }

    private addFilterOptions(filterType: string) {
        api.getKeyTerms(filterType, (error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            }

            let newKeyterms: Array<any> = response.map((keyterm: any) => ({
                label: keyterm.name,
                value: keyterm.name
            }));

            this.setState({
                filterOptions: this.state.filterOptions.concat(newKeyterms)
            });
        });
    }

    render() {
        return (
            <div className="Search-element">
                <CreatableSelect
                    isMulti
                    isClearable
                    options={this.state.filterOptions.sort((a: any, b: any) => { return a.value.localeCompare(b.value) })}
                    className="basic-multi-select select-menu"
                    classNamePrefix="select"
                    placeholder="Select keyterms..."
                    onChange={(e: any) => this.handleChange(e)}
                    value={this.state.values.map((value: String) => { return { label: value, value }})}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 3,
                        colors: {
                        ...theme.colors,
                          primary25: 'rgb(162, 156, 194)',
                          primary: 'rgb(162, 156, 194)',
                        },
                      })}
                />
            </div>
        );
    }
}

interface IKeytermSearchProps {
    keyterms: Array<String>;
    updateKeyterm: (event: object) => void;
}

interface IKeytermSearchState {
    values: Array<String>;
    filterOptions: Array<Object>;
}
