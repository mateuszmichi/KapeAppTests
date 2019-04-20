import React from "react";

const TYPES = Object.freeze({
  NORMAL: "normal",
  UPPER: "upper",
  LOWER: "lower"
});

const typesConverter = {
  [TYPES.NORMAL]: str => str,
  [TYPES.UPPER]: str => <sup>{str}</sup>,
  [TYPES.LOWER]: str => <sub>{str}</sub>
};

const getBracketExpr = str => {
  const pos = str.indexOf("}");
  return {
    start: str.slice(1, pos),
    end: str.slice(pos + 1)
  };
};

const getFirstChart = str => ({
  start: str.slice(0, 1),
  end: str.slice(1)
});

const splitChartConverter = (str, splitter, type) => {
  const result = [];
  const [first, ...rest] = str.split(splitter);
  if (first.length) {
    result.push({
      type: TYPES.NORMAL,
      string: first
    });
  }
  rest.forEach(e =>
    (fun => {
      const { start, end } = fun(e);
      if (start.length) {
        result.push({
          type: type,
          string: start
        });
      }
      if (end.length) {
        result.push({
          type: TYPES.NORMAL,
          string: end
        });
      }
    })(e.startsWith("{") ? getBracketExpr : getFirstChart)
  );
  return result;
};

const supConverter = str => splitChartConverter(str, "^", TYPES.UPPER);

const subConverter = str => splitChartConverter(str, "_", TYPES.LOWER);

export const mathTextConverter = str => {
  try {
    let result = [
      {
        type: TYPES.NORMAL,
        string: str
      }
    ];
    const converters = [supConverter, subConverter];
    converters.forEach(conv => {
      let nResult = [];
      result.forEach(({ type, string }) => {
        if (type === TYPES.NORMAL) {
          nResult = [...nResult, ...conv(string)];
        } else {
          nResult.push({
            type,
            string
          });
        }
      });
      result = nResult;
    });
    return result.map(({ type, string }) => typesConverter[type](string));
  } catch {
    return str;
  }
};
