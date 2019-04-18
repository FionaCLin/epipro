import React from 'react';
import '../css/Home.css';
import Select from 'react-select';
import DiseaseList from '../dummydata/disease_list.json';
import SyndromeList from '../dummydata/syndrome_list.json';

const filterTypes: Array<any> = [
    { label: 'Disease', value: 0, type: 'disease' },
    { label: 'Syndrome', value: 1, type: 'syndrome' }
];

export default class DiseaseSearch extends React.Component<IDiseaseSearchProps, IDiseaseSearchState> {
    constructor(props: IDiseaseSearchProps) {
        super(props);

        this.state = {
            filterType: 0,
            value: this.props.disease,
            filterOptions: this.addFilterOptions()
        }
    }

    private handleChange(event: any) {
        console.log(event);
        this.setState({ value: event.label });
        this.props.updateDisease({ disease: event.label });
    }

    private addFilterOptions() {
        let diseases: Array<Object> = DiseaseList.map((disease: any) => {
            return { label: disease.name, value: disease.name, type: 'disease' }
        });
        return diseases;
    }

    render() {
        return (
            <div className="Filter-element">
                <b>Diseases</b>
                <div className='Keyterm-flex'>
                    <div className='Keyterm-right'>
                        <Select
                            options={this.state.filterOptions.sort((a: any, b: any) => { return a.value.localeCompare(b.value) })}
                            classNamePrefix="select"
                            placeholder="Select disease..."
                            onChange={(e: any) => this.handleChange(e)}
                        />
                    </div>
                </div>
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