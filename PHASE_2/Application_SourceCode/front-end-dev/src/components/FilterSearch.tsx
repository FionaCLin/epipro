import React from 'react';
import '../css/Home.css';
import Select from 'react-select';
import Keyterms from '../dummydata/keyterms.json';
import Locations from '../dummydata/locations.json';
import { string } from 'prop-types';

export default class FilterSearch extends React.Component<IFilterSearchProps, IFilterSearchState> {
  constructor(props: IFilterSearchProps) {
    super(props);

    let dataOptions: IFilterOptions = {
        keyterms: Keyterms,
        locations: Locations
    };
    let filterOptions: Array<Object> = dataOptions[this.props.type];
    this.state = {
        values: [],
        filterOptions
    }
  }
  
  private handleChange(event: Array<any>) {
    let values: Array<string> = event.map(option => (option.value));
    this.setState({values});
    let filterReturn: any = {};
    filterReturn[this.props.type] = values;
    this.props.updateFilter(filterReturn);
  }

  private makeLabel(type: string) {
      let label: string = type.charAt(0).toUpperCase() + type.slice(1);
      label = label.substr(0, label.length-1);
      return label;
  }

  render() {
    let placeholder: string = 'Select ' + this.props.type + '...';
    let label: string = this.makeLabel(this.props.type);

    return (
        <div className="Filter-element">
            <b>{label}</b>
            <Select
                isMulti
                options={this.state.filterOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder={placeholder}
                onChange={(e:any) => this.handleChange(e)}
            />
        </div>
    );
  }
}

interface IFilterOptions {
    keyterms: Array<Object>;
    locations: Array<Object>;
    [key: string]: Array<Object>;
}

interface IFilterSearchProps {
    type: string;
    updateFilter: (event: object) => void;
}

interface IFilterSearchState {
    values: Array<string>;
    filterOptions: Array<Object>   
}