import { range } from "lodash";
import moment from "moment";

const AUTO = "auto";

const autoRanges = [
  {
    limit: 2,
    span: 0.5
  },
  {
    limit: 4,
    span: 1
  },
  {
    limit: 7.5,
    span: 2
  },
  {
    limit: 10,
    span: 2.5
  }
];
const minPower = -1;

const calculatePower = ({ min, max }) => {
  const range = max - min;
  const logRange = Math.max(Math.floor(Math.log10(range)), minPower);
  return Math.pow(10, logRange);
};

const calculateSpan = ({ min, max }) => {
  const power = calculatePower({ min, max });
  const digit = (max - min) / power;
  let i = 0;
  while (digit > autoRanges[i].limit && i + 1 < autoRanges.length) {
    i++;
  }
  return power * autoRanges[i].span;
};

const minTick = ({ min }, span) => span * Math.floor(min / span);
const maxTick = ({ max }, span) => span * Math.ceil(max / span);
const minValue = minTick;
const maxValue = maxTick;

const formatRange = (range, auto) =>
  range === AUTO ? auto : Number.parseFloat(range);

const getRangeFromData = values => ({
  min: Math.min(...values),
  max: Math.max(...values)
});

const getTicks = ({ min, max }, span) => range(min, max + span / 2, span);

export const dateTicks = ({ dateFrom, dateTo }, datesNumber, withTime) => {
  const start = moment.unix(dateFrom / 1000);
  const end = moment.unix(dateTo / 1000);
  const duration = moment.duration(end.diff(start));
  const periods = withTime ? duration.asHours() : duration.asDays();
  const number = Math.min(periods, datesNumber - 1);
  const span = Math.floor(periods / number);
  const result = [];
  const iter = moment(start);
  while (!iter.isAfter(end)) {
    result.push(iter.format("x"));
    iter.add(span, withTime ? "hours" : "day");
  }
  return result;
};

export const chartRangesFromConfig = (
  values,
  { rangeFrom, rangeTo, rangeSpan }
) => {
  const { min, max } = getRangeFromData(values);
  const from = formatRange(rangeFrom, min);
  const to = formatRange(rangeTo, max);
  const range = {
    min: from,
    max: to
  };
  const span = formatRange(rangeSpan, calculateSpan(range));
  return {
    domainMin: formatRange(rangeFrom, minValue(range, span)),
    domainMax: formatRange(rangeTo, maxValue(range, span)),
    ticks: getTicks(
      {
        min: minTick(range, span),
        max: maxTick(range, span)
      },
      span
    )
  };
};

const regresionData = (xData, yData) =>
  xData.reduce(
    ({ sx2, sx, sxy, sy }, x, i) => ({
      sx2: sx2 + x * x,
      sx: sx + x,
      sxy: sxy + yData[i] * x,
      sy: sy + yData[i]
    }),
    {
      sx2: 0,
      sx: 0,
      sxy: 0,
      sy: 0
    }
  );

export const regresion = (xData, yData) => {
  const { sx, sy, sxy, sx2 } = regresionData(xData, yData);
  const n = xData.length;
  const a = (sxy * n - sx * sy) / (sx2 * n - sx * sx);
  return {
    a,
    b: (sy - a * sx) / n
  };
};
