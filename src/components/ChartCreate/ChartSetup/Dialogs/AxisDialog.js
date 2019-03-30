import React, { Component } from "react";
import PropTypes from "prop-types";
// imported elements
import ColorSelect from "../../../Common/ColorSelect";
// ant.design
import { Checkbox, Form, Row, Col, Input, Button, Select } from "antd";
const { Option } = Select;

class AxisSideSelect extends Component {
  render() {
    return (
      <Select placeholder="Pozycja na wykresie" {...this.props}>
        <Option key="left" value="left">
          Po lewej stronie
        </Option>
        <Option key="right" value="right">
          Po prawej stronie
        </Option>
      </Select>
    );
  }
}

class AxisForm extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["edit", "load"]).isRequired,
    editedAxis: PropTypes.object,
    onClose: PropTypes.func,
    loadData: PropTypes.func,
    updateData: PropTypes.func
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (this.props.mode === "edit") {
        // TODO strzal / update info
      } else {
        this.props.loadData(
          Object.keys(fieldsValue).reduce(
            (prev, field) => ({
              ...prev,
              [field]: {
                value: fieldsValue[field]
              }
            }),
            {}
          )
        );
        this.handleReset();
        this.props.onClose();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        layout="vertical"
        onSubmit={this.handleSubmit}
        hideRequiredMark={true}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div className="LoadDataDialogInner">
          <Form.Item>
            {getFieldDecorator("showAxis", {
              initialValue: true,
              valuePropName: "checked"
            })(<Checkbox>Pokaż oś na wykresie</Checkbox>)}
          </Form.Item>
          <Form.Item label="Opis osi">
            {getFieldDecorator("description", {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  message:
                    "Proszę podać nazwę osi, która pozwoli na identyfikację"
                },
                {
                  message: "Wymagana nazwa o długości od 2 do 20 znaków",
                  whitespace: true,
                  min: 2,
                  max: 20
                }
              ]
            })(<Input placeholder="Opis osi" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("showDescription", {
              initialValue: true,
              valuePropName: "checked"
            })(<Checkbox>Pokaż nazwę osi na wykresie</Checkbox>)}
          </Form.Item>
          <Form.Item label="Jednostka">
            {getFieldDecorator("unit", {
              initialValue: "",
              rules: [
                {
                  message: "Maksymalna długość to 10 znaków",
                  whitespace: true,
                  max: 10
                }
              ]
            })(<Input placeholder="Jednostka" />)}
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Miejsce wyświetlania">
                {getFieldDecorator("side", {
                  rules: [
                    {
                      required: true,
                      message: "Wybierz miejsce wyświetlania"
                    }
                  ],
                  initialValue: "left"
                })(<AxisSideSelect />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kolor osi">
                {getFieldDecorator("color", {
                  validateTrigger: ["onChange"],
                  rules: [
                    {
                      required: true,
                      message: "Wybierz kolor osi"
                    }
                  ],
                  initialValue: "black"
                })(<ColorSelect />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Zarządzanie zakresem danych"
            help="Aby ustawić automatyczne wyliczanie, wpisz auto"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Od">
                  {getFieldDecorator("rangeFrom", {
                    initialValue: "auto",
                    rules: [
                      {
                        required: true,
                        message: "Proszę podać początek zakresu"
                      }
                    ]
                  })(<Input placeholder="Początek zakresu" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Do">
                  {getFieldDecorator("rangeTo", {
                    initialValue: "auto",
                    rules: [
                      {
                        required: true,
                        message: "Proszę podać koniec zakresu"
                      }
                    ]
                  })(<Input placeholder="Początek zakresu" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Krok">
                  {getFieldDecorator("rangeSpan", {
                    initialValue: "auto",
                    rules: [
                      {
                        required: true,
                        message:
                          "Proszę podać krok pomiędzy punktami odniesienia"
                      }
                    ]
                  })(<Input placeholder="Krok" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </div>
        <div className="LoadDataDialogSubmit">
          <Button onClick={this.handleReset} style={{ marginRight: 16 }}>
            Zresetuj
          </Button>
          <Button type="primary" icon="plus" htmlType="submit">
            Dodaj
          </Button>
        </div>
      </Form>
    );
  }
}

const WrappedEditAxisForm = Form.create({
  name: "edit_axis_form",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return Object.keys(props.editedAxis).reduce(
      (prev, key) => ({
        ...prev,
        [key]: Form.createFormField({ ...props.editedAxis[key] })
      }),
      {}
    );
  }
})(AxisForm);

const WrappedLoadAxisForm = Form.create({
  name: "load_axis_form"
})(AxisForm);

class AxisDialog extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["load", "edit"]).isRequired,
    editedAxis: PropTypes.object,
    onClose: PropTypes.func,
    loadData: PropTypes.func,
    updateData: PropTypes.func
  };

  onUpdateFields = changedFields => {
    const { editedAxis, updateData } = this.props;
    if (changedFields !== editedAxis) {
      console.log({
        ...editedAxis,
        ...changedFields
      });
      updateData({
        ...editedAxis,
        ...changedFields
      });
    }
  };

  render() {
    const { mode, editedAxis, loadData, updateData, onClose } = this.props;
    return (
      <div className="LoadDataDialog">
        {mode === "edit" ? (
          <WrappedEditAxisForm
            mode={mode}
            onClose={onClose}
            updateData={updateData}
            editedAxis={editedAxis}
            onChange={this.onUpdateFields}
          />
        ) : (
          <WrappedLoadAxisForm
            mode={mode}
            onClose={onClose}
            loadData={loadData}
          />
        )}
      </div>
    );
  }
}

export default AxisDialog;
