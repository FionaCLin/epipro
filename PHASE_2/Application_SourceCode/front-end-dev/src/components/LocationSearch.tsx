import React from 'react';
import '../css/Home.css';
import Select from 'react-select';
import Locations from '../dummydata/locations.json';
import { BackendAPI } from '../API'

let api = new BackendAPI();


export default class LocationSearch extends React.Component<ILocationSearchProps, ILocationSearchState> {
  constructor(props: ILocationSearchProps) {
    super(props);

    let filterOptions: Array<Object> = Locations.map((location, index) => ({
      label: location.city + ", " + location.state + ", " + location.country,
      value: index
    }));
    console.log(filterOptions);
    this.state = {
      values: [],
      filterOptions
    }
  }

  private handleChange(event: Array<any>) {
    let values: Array<Number> = event.map(option => (option.value));
    this.setState({ values });
    console.log({ values });
    this.props.updateLocation({ locations: values });
  }

  render() {

    // Fetch Data
    let Locations: any;

    api.getLocations((error: any, response: any) => {
      if (error) {
        if (error.response) {
          let message = error.response.data.message
          console.log(message, 'ppp');
        } else {
          console.log(error.message, 'ppp');
        }
      }
      Locations = response;
      console.log(Locations, 'locations in Location tsx')
    });

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
        />
      </div>
    );
  }
}

interface ILocationSearchProps {
  updateLocation: (event: object) => void;
}

interface ILocationSearchState {
  values: Array<Number>;
  filterOptions: Array<Object>
}
