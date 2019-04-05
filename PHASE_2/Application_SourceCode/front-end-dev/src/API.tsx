import axios, { AxiosError, AxiosResponse } from 'axios'

export interface IFilterOptions {
    keyterms: string;
    locations: string;
    startDate: string;
    endDate: string;
}

export class BackendAPI {
  baseURL: string = 'https://epiproapp.appspot.com/'
  getKeyTerms(type: string, cb: (err: any, res: any) => any) {
    axios.get(`${this.baseURL}api/v1/reports/key-terms/${type}`)
      .then((response: AxiosResponse) => {
        cb(null, response.data)
      })
      .catch((error: AxiosError) => {
        cb(error, null)
      });
  }

  getLocations(cb: (err: any, res: any) => any) {
    axios.get(`${this.baseURL}/api/v1/reports/locations/all`)
    .then((response: AxiosResponse) => {
      cb(null, response.data)
    })
    .catch((error: AxiosError) => {
      cb(error, null)
    });
  }

  getLocationsByKeyword(keyword:string, cb: (err: any, res: any) => any) {
    axios.get(`${this.baseURL}api/v1/reports/locations/${keyword}`)
      .then((response: AxiosResponse) => {
        cb(null, response.data)
      })
      .catch((error: AxiosError) => {
        cb(error, null)
      });
  }

  getAllReports(cb: (err: any, res: any) => any) {
    axios.get(`${this.baseURL}api/v1/reports/filter`)
      .then((response: AxiosResponse) => {
        cb(null, response.data)
      })
      .catch((error: AxiosError) => {
        cb(error, null)
      });
  }

  getAPIdocURL(cb: (err: any, res: any) => any) {
    axios.get(`${this.baseURL}api/v1/doc-url`)
      .then((response: AxiosResponse) => {
        cb(null, response.data);
      })
      .catch((error: AxiosError) => {
        cb(error, null);
      });
  }

  getFilteredReports(filter: IFilterOptions, cb:(err: any, res: any) => any) {
    let q :string[] = [];
    if (filter.locations) {
      q.push(`Location=${filter.locations}`)
    }
    if (filter.keyterms) {
      q.push(`Key-terms=${filter.keyterms}`)
    }
    if (filter.startDate) {
      q.push(`Start-date=${filter.startDate}`)
    }
    if(filter.endDate){
      q.push(`End-date=${filter.endDate}`)
    }
    let url = '';

    let query = q.join('&')
    url = `${this.baseURL}api/v1/reports/filter?${query}`

    console.log(url);
 
    axios.get(url)
      .then((response: AxiosResponse) => {
        cb(null, response.data)
      })
      .catch((error: AxiosError) => {
        cb(error, null)
      });
  }
}  
