import moment from "moment";

export const RandomSerie = ({
  from = 10,
  to = 15,
  wavePeriod = 1,
  waveScale = 0,
  rand = 0.2,
  dataSets = 50,
  dataSetBegin = 1,
  dataSetEnd = 50
}) => {
  const result = [];
  for (let i = 0; i < dataSets; i++) {
    const generated =
      from +
      ((to - from) * i) / (dataSets - 1) +
      Math.sin(((i / (dataSets - 1)) * 2 * Math.PI) / wavePeriod) * waveScale +
      rand * Math.random();
    result.push(generated.toFixed(2));
  }
  return result;
};
export const DataSetLabel = ({
  dataSets = 50,
  dataSetBegin = 1,
  dataSetEnd = 50
}) => {
  const result = [];
  const begin = moment("2019-03-22");
  for (let i = 0; i < dataSets; i++) {
    result.push({
      time: begin.format("x")
    });
    begin.add(1, "hours");
  }
  return result;
};

const Generator = {
  outside_temperature: () =>
    RandomSerie({ from: -3, to: 10, wavePeriod: 0.5, waveScale: 5, rand: 0.5 }),
  inside_temperature: () =>
    RandomSerie({ from: 18, to: 20, wavePeriod: 6, waveScale: 0.5, rand: 0.2 }),
  hot_water: () => RandomSerie({ from: 3667, to: 4223, rand: 8 }),
  electricity: () => RandomSerie({ from: 4567.23, to: 4644.89, rand: 0.8 })
};

const TestDataGenerator = (generator = Generator) => {
  const result = DataSetLabel({});
  Object.keys(generator).forEach(key => {
    const data = generator[key]();
    data.forEach((val, i) => {
      result[i][key] = val;
    });
  });
  return result;
};

export default TestDataGenerator;
