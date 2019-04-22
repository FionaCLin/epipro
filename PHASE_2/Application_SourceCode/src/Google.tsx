import axios, { AxiosError, AxiosResponse } from 'axios'


export interface IFilterOptions {
    disease: string;
    location: string;
    startDate: string;
    endDate: string;
}

export default class GoogleAPI {
    baseURL: string = 'https://newsapi.org/';
    apiKey: string = '112874d7eb274abf8417934c83a1ba07';
    // apiKey: string = '93ab589956f84076963dac0eb76d6a41';
    // apiKey: string = 'eda37975a50a479cb28a43249df18ae2';

    getFilteredMedia(filter: IFilterOptions, cb:(err: any, res: any) => any) {
        let q :string[] = [];
        if (filter.disease) {
            let temp: string = `q="${filter.disease}"`;
            if (filter.location) {
                temp += `+"${filter.location}"`;
            }
            q.push(temp);
        }
        if (filter.startDate) {
            q.push(`from=${filter.startDate}`);
        }
        if (filter.endDate){
            q.push(`to=${filter.endDate}`);
        }
        q.push('pageSize=100');

        if (q.length !== 0) {
            q.push(`apiKey=${this.apiKey}`);
            let query = q.join('&');
            let url = `${this.baseURL}v2/everything?${query}`
    
            axios.get(url)
                .then((response: AxiosResponse) => {
                    cb(null, response.data)
                })
                .catch((error: AxiosError) => {
                    cb(error, null)
            });
        }
    }
}
