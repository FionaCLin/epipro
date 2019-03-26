import React from 'react';
import '../css/Home.css';
import Select from 'react-select';
import Keyterms from '../dummydata/keyterms.json';
import { string } from 'prop-types';
import { BackendAPI } from '../API'

let api = new BackendAPI();

export default class KeytermSearch extends React.Component<IKeytermSearchProps, IKeytermSearchState> {
  constructor(props: IKeytermSearchProps) {
    super(props);

    let keyterms: Array<any> = Keyterms.map((keyterm, index) => ({
        label: keyterm.name,
        value: index,
        type: keyterm.type
    }))

    this.state = {
        filterType: 0,
        values: [],
        filterOptions: keyterms,
        keyterms
    }
  }
  
  private handleChange(event: Array<any>) {
    let values: Array<Number> = event.map(option => (option.value));
    this.setState({values});
    this.props.updateKeyterm(({keyterms: values}));
  }

  private changeType(event: any, filterTypes: Array<any>) {
      this.setState({filterType: event.value});
      if (event.value == 0) {
          this.setState({filterOptions: this.state.keyterms});
      } else {
          this.setState({filterOptions: this.state.keyterms.filter(keyterm =>
            (keyterm.type === filterTypes[event.value].type)
            )});
      }
  }

  render() {
    let key_terms;
    api.getKeyTerms('general', (error: any, response: any) => {
        if (error) {
            if (error.response) {
                let message = error.response.data.message
                console.log(message, 'ppp');
            } else {
                console.log(error.message, 'ppp');
            }
        }
        key_terms = response;
        console.log(key_terms, 'general key term in keyterm search tsx')
    });

    api.getKeyTerms('specific', (error: any, response: any) => {
        if (error) {
            if (error.response) {
                let message = error.response.data.message
                console.log(message, 'ppp');
            } else {
                console.log(error.message, 'ppp');
            }
        }
        key_terms = response;
        console.log(key_terms, 'specific key term in keyterm search tsx')
    });

    let filterTypes: Array<any> = [
        { label: 'All', value: 0, type: 'all' },
        { label: 'General', value: 1, type: 'general' },
        { label: 'Specific', value: 2, type: 'specific' }
    ]
    return (
        <div className="Filter-element">
            <b>Keyterms</b>
            <div className='Keyterm-flex'>
                <div className='Keyterm-left'>
                    <Select
                        value={filterTypes.filter(type => type.value == this.state.filterType)}
                        options={filterTypes}
                        onChange={(e:any) => this.changeType(e, filterTypes)}
                    />
                </div>
                <div className='Keyterm-right'>
                    <Select
                        isMulti
                        options={this.state.filterOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select keyterms..."
                        onChange={(e:any) => this.handleChange(e)}
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
