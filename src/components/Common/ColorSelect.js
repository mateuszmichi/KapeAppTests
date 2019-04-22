import React, { Component } from "react";
// imported elements
// css
import "../../css/Common/ColorSelect.css";
// ant.design
import { Select } from "antd";
const { Option } = Select;

const colors = [
  {
    description: "Ciemnoszary",
    color: "#333"
  },
  {
    description: "Czarny",
    color: "black"
  },
  {
    description: "Niebieski",
    color: "blue"
  },
  {
    description: "Czerwony",
    color: "red"
  }
];

export default class ColorSelect extends Component {
  render() {
    return (
      <Select placeholder="Kolor linii" {...this.props}>
        {colors.map((e, i) => (
          <Option key={i} value={e.color}>
            <div>
              <div
                className="ColorSelectColor"
                style={{ background: e.color }}
              />
              <span>{e.description}</span>
            </div>
          </Option>
        ))}
      </Select>
    );
  }
}
