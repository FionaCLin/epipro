import React from 'react';
import '../css/Basic.css';
import Select from 'react-select';
import { BackendAPI } from '../API';

let api = new BackendAPI();

export default class DiseaseSearch extends React.Component<IDiseaseSearchProps, IDiseaseSearchState> {
    constructor(props: IDiseaseSearchProps) {
        super(props);

        this.state = {
            filterType: 0,
            value: this.props.disease,
            filterOptions: []
        }
    }

    componentWillMount() {
        api.getDiseases((error: any, response: any) => {
            if (error && error.response) {
                let message = error.response.data.message
                console.log('error message', message);
            } else if (error) {
                console.log('error message', error.message);
            } else {
                this.setState({filterOptions: this.addFilterOptions(response)});
            }
        });
    }

    private handleChange(event: any) {
        this.setState({ value: event.label });
        this.props.updateDisease({ disease: event.label });
    }

    private addFilterOptions(response: Array<{name: string}>) {
        let diseases: Array<Object> = response.map((disease: {name: string}) => {
            return { label: disease.name, value: disease.name, type: 'disease' }
        });
        return diseases;
    }

    render() {
        return (
            <div className="Search-element">
                <Select
                    options={this.state.filterOptions.sort((a: any, b: any) => { return a.value.localeCompare(b.value) })}
                    classNamePrefix="select"
                    placeholder="Select disease..."
                    onChange={(e: any) => this.handleChange(e)}
                    value={(this.state.value != '') ? { label: this.state.value, value: this.state.value } : null}
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

interface IDiseaseSearchProps {
    updateDisease: (event: object) => void;
    disease: string;
}

interface IDiseaseSearchState {
    filterType: number;
    value: string;
    filterOptions: Array<Object>;
}