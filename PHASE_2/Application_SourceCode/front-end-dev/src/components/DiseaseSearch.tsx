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
        let syndromes: Array<Object> = SyndromeList.map((syndrome: any) => {
            return { label: syndrome.name, value: syndrome.name, type: 'syndrome' }
        });
        return diseases.concat(syndromes);
    }

    private changeType(event: any) {
        this.setState({
            filterType: event.value
        });
    }

    render() {
        return (
            <div className="Filter-element">
                <b>Illnesses</b>
                <div className='Keyterm-flex'>
                    <div className='Keyterm-left'>
                        <Select
                            value={filterTypes.filter(type => type.value == this.state.filterType)}
                            options={filterTypes}
                            onChange={(e: any) => this.changeType(e)}
                        />
                    </div>
                    <div className='Keyterm-right'>
                        <Select
                            options={this.state.filterOptions.filter((option: any) => option.type == filterTypes[this.state.filterType].type)}
                            classNamePrefix="select"
                            placeholder="Select illness..."
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