import axios, { AxiosError, AxiosResponse } from 'axios'

interface IFilterOptions {
    keyterms: string;
    locations: string;
    start_date: string;
    end_date: string;
    
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
    axios.get(`${this.baseURL}api/v1/reports/all`)
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
        cb(null, response.data)
      })
      .catch((error: AxiosError) => {
        cb(error, null)
      });
  }

  getFiltedReports(filter: IFilterOptions, cb:(err: any, res: any) => any) {
    let q :string[] = [];
    if (filter.locations) {
      q.push(`Location=${filter.locations}`)
    }
    if (filter.keyterms) {
      q.push(`Key-terms=${filter.keyterms}`)
    }
    if (filter.start_date) {
      q.push(`Start-date=${filter.start_date}`)
    }
    if(filter.end_date){
      q.push(`End-date=${filter.start_date}`)
    }
    let url = '';
    if (q.length>1) {
      url = `${this.baseURL}api/v1/reports/filter?${q[0]}`
    } else {
      let query = q.join('&')
      url = `${this.baseURL}api/v1/reports/filter?${query}`
    }
 
    axios.get(url)
      .then((response: AxiosResponse) => {
        cb(null, response.data)
      })
      .catch((error: AxiosError) => {
        cb(error, null)
      });
  }
}  
