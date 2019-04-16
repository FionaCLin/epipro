import axios, { AxiosResponse, AxiosError } from "axios";
import twitter from 'twitter';

export interface IFilterOptions {
    disease: string;
    location: string;
    startDate: string;
    endDate: string;
}

export default class TwitterAPI {
    baseURL: string = 'https://api.twitter.com/1.1/';
    token: string = 'AAAAAAAAAAAAAAAAAAAAAE4u9wAAAAAAFfm2OtiR18Mpkrhod2Qif0oBYWg%3DgQblAjXSIAWNZA38v2g0MqjBolRnn8LC98PnVqe7WLKYExM0Yy';

    client = new twitter({
        consumer_key: 'UZM9rSwo2rQ6aukC5jA9kHdZ6',
        consumer_secret: '6LpQcaJLjL6NsMYp6FNxmRPYP76iRQCDxvMGnw2tnti5zboiB7',
        // access_token_key: '1114466561274683395-lh2q9hVstPaUyU3mfHxelC35Ro3UFc',
        // access_token_secret: 'mSMj5aQZs84k6s7DGlKqvDyjCd0e9bLpkH5RHU9B5m6h9'
        bearer_token: 'AAAAAAAAAAAAAAAAAAAAAE4u9wAAAAAAFfm2OtiR18Mpkrhod2Qif0oBYWg%3DgQblAjXSIAWNZA38v2g0MqjBolRnn8LC98PnVqe7WLKYExM0Yy'
    });

    formatTwitterDate(date: string) {
        let newDate: string = date.replace(/T|-|:/g, '');
        return newDate.slice(0, newDate.length - 2);
    }

    getFilteredMedia(filter: IFilterOptions, cb:(err: any, res: any) => any) {
        let q: any = {};
        if (filter.disease) {
            q['query'] = `is:verified ${filter.disease}`;
            if (filter.location) {
                q['query'] += ` ${filter.location}`;
            }
        }
        if (filter.startDate) {
            q['fromDate'] = this.formatTwitterDate(filter.startDate);
        }
        if (filter.endDate) {
            q['toDate'] = this.formatTwitterDate(filter.endDate);
        }

        if (Object.keys(q).length != 0) {
            let config = {
                headers: {
                    request: 'POST',
                    authorization: `Bearer ${this.token}`,
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
                    'Access-Control-Allow-Methods': "DELETE, POST, GET, OPTIONS",
                    'Access-Control-Allow-Headers': "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                },
                params: q
            }
            let url =  `${this.baseURL}search/30day/development.json`;
            axios.get(url, config)
                .then((response: AxiosResponse) => {
                    console.log(response.data);
                    cb(null, response.data);
                })
                .catch((error: AxiosError) => {
                    cb(error, null)
            });
            // this.client.get('search/30day/development', q, function(error, tweets, response) {
            //     console.log(tweets);
            // });
        }
    }
}