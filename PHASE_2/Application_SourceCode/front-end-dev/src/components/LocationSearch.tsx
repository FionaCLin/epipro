import React from 'react';
import '../css/Home.css';
import Select from 'react-select';
import { BackendAPI } from '../API'

let api = new BackendAPI();


export default class LocationSearch extends React.Component<ILocationSearchProps, ILocationSearchState> {
  constructor(props: ILocationSearchProps) {
    super(props);

    this.state = {
      values: [],
      filterOptions:[]
    }
  }

  componentWillMount(){
    // Fetch Data
    let Locations: any;

    api.getLocations((error: any, response: any) => {
      if (error) {
        if (error.response) {
          let message = error.response.data.message
          console.log('error message', message);
        } else {
          console.log('error message', error.message);
        }
      }
      Locations = response;
      let filterOptions: Array<Object> = Locations.map((location:any, index:number) => ({
        label: `City: ${location.city}, State: ${location.state}, Country: ${location.country}`,
        value: index
      }));
      this.setState({
        values: [],
        filterOptions
      })
    });
  }
  private handleChange(event: Array<any>) {
    let values: Array<Number> = event.map(option => (option.value));
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
