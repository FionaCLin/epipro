import React from 'react';
import '../css/Home.css';
import Select from 'react-select';
import { BackendAPI } from '../API'

let api = new BackendAPI();


export default class LocationSearch extends React.Component<ILocationSearchProps, ILocationSearchState> {
  constructor(props: ILocationSearchProps) {
    super(props);

    this.state = {
      values: this.props.locations,
      filterOptions: []
    }
  }

  componentWillMount() {
    api.getLocations((error: any, response: any) => {
      if (error && error.response) {
        let message = error.response.data.message
        console.log('error message', message);
      } else if (error) {
        console.log('error message', error.message);
      }
      let filterOptions: Array<Object> = this.createFilterOptions(response);

      this.setState({filterOptions})
    });
  }

  createFilterOptions(locations: Array<any>) {
    let filteredLocations: Array<string> = [];

    filteredLocations = locations.map((location: any) => this.createLocationLabel(location));
    filteredLocations = filteredLocations.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    });

    return filteredLocations.map((location: string, index: number) => ({
      label: location,
      value: index
    }));
  }

  createLocationLabel(location: any) {
    let locationLabel: string = '';
    
    if (location.city.length != 0) locationLabel = locationLabel.concat(location.city, ", ");
    if (location.state.length != 0) locationLabel = locationLabel.concat(location.state, ", ");
    if (location.country.length != 0) locationLabel = locationLabel.concat(location.country);
  
    return locationLabel;
  }

  private handleChange(event: Array<any>) {
    let values: Array<String> = event.map(option => (option.label));
    this.setState({ values });
    console.log({ values });
    this.props.updateLocation({ locations: values });
  }

  render() {
    return (
      <div className="Filter-element">
        <b>Locations</b>
        <Select
          isMulti
          options={this.state.filterOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select location..."
          onChange={(e: any) => this.handleChange(e)}
          value={this.state.values.map((value: String) => { return { label: value, value }})}
        />
      </div>
    );
  }
}

interface ILocationSearchProps {
  updateLocation: (event: object) => void;
  locations: Array<string>;
}

interface ILocationSearchState {
  values: Array<String>;
  filterOptions: Array<Object>
}
