import React, { Component } from "react";
import PropTypes from "prop-types";
// imported elements
import ColorSelect from "../../../Common/ColorSelect";
// ant.design
import { Checkbox, Form, Row, Col, Input, InputNumber, Button } from "antd";

class XAxisForm extends Component {
  static propTypes = {
    editedAxis: PropTypes.object,
    onClose: PropTypes.func,
    updateData: PropTypes.func
  };

  render() {
    const { onClose } = this.props;
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
              ],
              initialValue: "Czas"
            })(<Input placeholder="Opis osi" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("showDescription", {
              initialValue: true,
              valuePropName: "checked"
            })(<Checkbox>Pokaż nazwę osi na wykresie</Checkbox>)}
          </Form.Item>
          <Row gutter={24}>
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
          <Form.Item label="Zarządzanie zakresem czasu">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Minimalna ilość dat na osi"
                  help="Wyświetlna liczba może być mniejsza dla krótkich okresów"
                >
                  {getFieldDecorator("datesNumber", {
                    initialValue: 5,
                    rules: [
                      {
                        required: true,
                        type: "number",
                        min: 2,
                        max: 8,
                        message: "Wybierz liczbę z zakresu od 2 do 8"
                      }
                    ]
                  })(
                    <InputNumber
                      className="AutoInputNumber"
                      min={2}
                      max={8}
                      step={1}
                      precision={0}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator("withTime", {
                    initialValue: false,
                    valuePropName: "checked"
                  })(<Checkbox>Pokaż godzinę</Checkbox>)}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </div>
        <div className="LoadDataDialogSubmit">
          <Button type="primary" icon="redo" onClick={onClose}>
            Aktualizuj
          </Button>
        </div>
      </Form>
    );
  }
}

const WrappedXAxisForm = Form.create({
  name: "edit_xaxis_form",
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
})(XAxisForm);

class XAxisDialog extends Component {
  static propTypes = {
    editedAxis: PropTypes.object,
    onClose: PropTypes.func,
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
    const { editedAxis, updateData, onClose } = this.props;
    return (
      <div className="LoadDataDialog">
        <WrappedXAxisForm
          editedAxis={editedAxis}
          onClose={onClose}
          updateData={updateData}
          onChange={this.onUpdateFields}
        />
      </div>
    );
  }
}

export default XAxisDialog;
