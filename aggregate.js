let output = require('./mockup-data.json')[1]

let convertFrequency = (data, interval) => {
  let intervals = {
    'year': 1,
    'month': 2
  };
  let start_date = data[0].date.split('-')[intervals[interval]-1];
  let end_date = data[data.length - 1].date.split('-')[intervals[interval]-1];

  let newFrequency = {}
  for (let k = start_date; k <= end_date; k++) {
    let p = k.toString();
    data.forEach((date, i) => {
      if (date.date.indexOf(p) !== -1) {
        let d = date.date.split('-').splice(0, intervals[interval]);
        if(!newFrequency.hasOwnProperty(d.join('-'))){
          newFrequency[d.join('-')] = 1;
        } else {
          newFrequency[d.join('-')] ++
        }
      }
      // console.log(typeof date.date, i, typeof p, p)
    })
  }
  return newFrequency;
}
console.log(output.frequency_graph.frequency)
let newF = convertFrequency(output.frequency_graph.frequency, 'month');
console.log(newF)
newF = convertFrequency(output.frequency_graph.frequency, 'year');
console.log(newF)
