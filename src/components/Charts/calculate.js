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

const regresionData = (data, xKey, yKey) => {
  const n = data.length;
  let { sx, sy } = data.reduce(
    ({ sx, sy }, d) => ({
      sx: sx + d[xKey],
      sy: sy + d[yKey]
    }),
    {
      sx: 0,
      sy: 0
    }
  );
  sx = sx / n;
  sy = sy / n;
  return {
    sx,
    sy,
    ...data.reduce(
      ({ rx2, ry2, rxy }, d) => ({
        rx2: rx2 + (d[xKey] - sx) * (d[xKey] - sx),
        ry2: ry2 + (d[yKey] - sy) * (d[yKey] - sy),
        rxy: rxy + (d[xKey] - sx) * (d[yKey] - sy)
      }),
      {
        rx2: 0,
        ry2: 0,
        rxy: 0
      }
    )
  };
};

export const regresion = (data, xKey, yKey) => {
  const { sx, sy, rx2, ry2, rxy } = regresionData(data, xKey, yKey);
  const a = rxy / rx2;
  const b = sy - a * sx;
  const ss = data.reduce(
    (prev, d) => prev + (a * d[xKey] + b - sy) * (a * d[xKey] + b - sy),
    0
  );
  console.log("R^2", ss / ry2);
  return {
    a,
    b,
    R2: ss / ry2
  };
};
