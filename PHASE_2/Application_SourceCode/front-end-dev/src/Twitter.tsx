import axios, { AxiosResponse, AxiosError } from "axios";
import twitter from 'twitter';

export interface IFilterOptions {
    disease: string;
    location: string;
    startDate: string;
    endDate: string;
}

export default class TwitterAPI {
    formatTwitterDate(date: string) {
        let newDate: string = date.replace(/T|-|:/g, '');
        return newDate.slice(0, newDate.length - 2);
    }

    getFilteredMedia(filter: IFilterOptions, cb:(err: any, res: any) => any) {
        let payload: any = {};
        if (filter.disease) {
            payload['query'] = `is:verified ${filter.disease}`;
            if (filter.location) {
                payload['query'] += ` ${filter.location}`;
            }
        }
        if (filter.startDate) {
            payload['fromDate'] = this.formatTwitterDate(filter.startDate);
        }
        if (filter.endDate) {
            payload['toDate'] = this.formatTwitterDate(filter.endDate);
        }
        
        if (Object.keys(payload).length != 0) {
            axios.post('http://localhost:8080/api/v1/twitter',payload)
                .then((response: AxiosResponse) => {
                    // console.log(response.data);
                    cb(null, response.data);
                })
                .catch((error: AxiosError) => {
                    cb(error, null)
            });
        }
    }
}
