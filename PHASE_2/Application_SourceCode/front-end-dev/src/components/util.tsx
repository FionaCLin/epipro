import { isNull, isNullOrUndefined } from 'util';

export function parseDates(date: string | null) {
    return (!isNull(date) ? new Date(date) : date);
}

export function stringifyDates(date: Date | null, dateType: string) {
    let temp = (!isNull(date)) ? new Date(date) : date;
    if (!isNull(temp)) {
        if (dateType == 'endDate') {
            temp.setSeconds(temp.getSeconds() - 1);
            temp.setDate(temp.getDate() + 1);
        }
        temp = new Date(temp.getTime() - (temp.getTimezoneOffset() * 60000));
    }
    return (!isNull(temp) ? temp.toISOString().slice(0, -5) : '');
}

function cleanLocations(locations: Array<string>) {
    let cleanLocations = [];
    for (let i = 0; i < locations.length; i++) {
        let multiLocation = locations[i].indexOf(',');
        let temp = locations[i];
        if (multiLocation != -1) {
            temp = temp.substring(0, multiLocation);
        }
        cleanLocations.push(temp);
    }
    return cleanLocations.join(', ');
}

export function createApiFilterState(state: any) {
    return ({
        keyterms: !isNullOrUndefined(state.keyterms) ? state.keyterms.join(',') : undefined,
        disease: state.disease,
        location: cleanLocations(state.locations),
        startDate: stringifyDates(state.startDate, 'startDate'),
        endDate: stringifyDates(state.endDate, 'endDate')
    })
}

export function cleanDate(date: string) {
    return shortenDate(date)
                .split('-')
                .reverse()
                .join('/');
}

export function shortenDate(date: string) {
    return date.substring(0, date.indexOf('T'));
}

export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatTwitterDate(date: string) {
    let newDate: string = date.replace(/T|-|:/g, '');
    return newDate.slice(0, newDate.length - 2);
}