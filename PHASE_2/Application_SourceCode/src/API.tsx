import axios, { AxiosResponse, AxiosError } from "axios";
import UNLOCodes from './data/country-codes.json';
import { formatTwitterDate } from "./components/util";

export interface IFilterOptions {
  keyterms?: string;
  disease?: string;
  location: string;
  startDate: string;
  endDate: string;
}

export class BackendAPI {
  baseURL: string = 'https://productionv1-dot-epiproapp.appspot.com/'
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

  getLocationsByKeyword(keyword: string, cb: (err: any, res: any) => any) {
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

  getFilteredReports(filter: IFilterOptions, cb: (err: any, res: any) => any) {
    let q: string[] = [];
    if (filter.location) {
      q.push(`Location=${filter.location}`)
    }
    if (filter.keyterms) {
      q.push(`Key-terms=${filter.keyterms}`)
    }
    if (filter.startDate) {
      q.push(`Start-date=${filter.startDate}`)
    }
    if (filter.endDate) {
      q.push(`End-date=${filter.endDate}`)
    }
    q.push(`Limit=300`);
    let url = '';

    let query = q.join('&')
    url = `${this.baseURL}api/v1/reports/filter?${query}`

    console.log(url);

    axios.get(url)
      .then((response: AxiosResponse) => {
        cb(null, response.data);
      })
      .catch((error: AxiosError) => {
        cb(error, null);
        console.log("CALL ERROR");
      });
  }

  getAnalyticReport(analytic: IFilterOptions, cb: (err: any, res: any) => any) {
    let q: string[] = [];
    if (analytic.location) {
      q.push(`Location=${analytic.location}`)
    }
    if (analytic.disease) {
      q.push(`Disease=${analytic.disease}`)
    }
    if (analytic.startDate) {
      q.push(`Start-date=${analytic.startDate}`)
    }
    if (analytic.endDate) {
      q.push(`End-date=${analytic.endDate}`)
    }

    let url = '';

    let query = q.join('&')
    url = `${this.baseURL}api/v1/analytics?${query}`

    console.log(url);

    axios.get(url)
      .then((response: AxiosResponse) => {
        cb(null, response.data);
      })
      .catch((error: AxiosError) => {
        cb(error, null);
        console.log("CALL ERROR");
      });
  }

  getDiseases(cb: (err: any, res: any) => any) {
    axios.get(`${this.baseURL}api/v1/reports/diseases/all`)
      .then((response: AxiosResponse) => {
        cb(null, response.data)
      })
      .catch((error: AxiosError) => {
        cb(error, null)
      });
  }

  getUNLOCode(country: string) {
    let code = UNLOCodes.filter(value => country.indexOf(value.CountryName) != -1);
    if (code.length == 0) {
      return '';
    } else {
      return code[0].CountryCode;
    }
  }

    getTwitterData(filter: IFilterOptions, cb:(err: any, res: any) => any) {
        let payload: any = {};
        if (filter.disease) {
            payload['query'] = `is:verified ${filter.disease}`;
            if (filter.location) {
                payload['query'] += ` ${filter.location}`;
            }
        }
        if (filter.startDate) {
            payload['fromDate'] = formatTwitterDate(filter.startDate);
        }
        if (filter.endDate) {
            payload['toDate'] = formatTwitterDate(filter.endDate);
        }

        if (Object.keys(payload).length != 0) {
            axios.post('https://production-dot-epiproapp.appspot.com/api/v1/twitter',payload)
                .then((response: AxiosResponse) => {
                    cb(null, response.data);
                })
                .catch((error: AxiosError) => {
                    cb(error, null)
            });
        }
    }
}
