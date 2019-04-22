import React, { Component } from "react";
import PropTypes from "prop-types";
// imported elements
// ant.design
import { Checkbox, Form, Input, Button, Slider } from "antd";

class EditSettingsForm extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    onClose: PropTypes.func
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.props.form.validateFields();
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <Form
        layout="vertical"
        hideRequiredMark={true}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div className="LoadDataDialogInner">
          <Form.Item label="Tytuł wykresu">
            {getFieldDecorator("title", {
              initialValue: ""
            })(<Input placeholder="Tytuł wykresu" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("showTitle", {
              initialValue: false,
              valuePropName: "checked"
            })(<Checkbox>Pokaż tytuł na wykresie</Checkbox>)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("showLegend", {
              initialValue: false,
              valuePropName: "checked"
            })(<Checkbox>Pokaż legendę na wykresie</Checkbox>)}
          </Form.Item>
          <Form.Item label={`Szerokość (${getFieldValue("width")}%)`}>
            {getFieldDecorator("width", {
              initialValue: 100,
              rules: [
                {
                  required: true,
                  type: "number",
                  min: 10,
                  max: 100,
                  message: "Wybierz liczbę z zakresu od 10 do 100"
                }
              ]
            })(<Slider step={5} min={10} max={100} />)}
          </Form.Item>
          <Form.Item label={`Wysokość (${getFieldValue("height")}%)`}>
            {getFieldDecorator("height", {
              initialValue: 60,
              rules: [
                {
                  required: true,
                  type: "number",
                  min: 10,
                  step: 5,
                  max: 100,
                  message: "Wybierz liczbę z zakresu od 10 do 100"
                }
              ]
            })(<Slider step={5} min={10} max={100} />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("horizontalGrid", {
              initialValue: true,
              valuePropName: "checked"
            })(<Checkbox>Pokaż poziome linie siatki</Checkbox>)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("verticalGrid", {
              initialValue: true,
              valuePropName: "checked"
            })(<Checkbox>Pokaż pionowe linie siatki</Checkbox>)}
          </Form.Item>
        </div>
        <div className="LoadDataDialogSubmit">
          <Button onClick={this.handleReset} style={{ marginRight: 16 }}>
            Zresetuj
          </Button>
          <Button type="primary" onClick={this.props.onClose}>
            Zakończ
          </Button>
        </div>
      </Form>
    );
  }
}

const updateValidationRules = {
  width: [value => value >= 10, value => value <= 100],
  height: [value => value >= 10, value => value <= 100]
};

const validateField = (field, value) =>
  !updateValidationRules[field] ||
  updateValidationRules[field].reduce(
    (result, rule) => result && rule(value),
    true
  );

const validateFields = fields =>
  Object.keys(fields).reduce(
    (prev, field) => prev && validateField(field, fields[field].value),
    true
  );

const WrappedEditSettingsForm = Form.create({
  name: "edit_settings_form",
  onFieldsChange(props, changedFields) {
    if (!validateFields(changedFields)) {
      return console.warn("Form not valid, abort update");
    }
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return Object.keys(props.settings).reduce(
      (prev, key) => ({
        ...prev,
        [key]: Form.createFormField({ ...props.settings[key] })
      }),
      {}
    );
  }
})(EditSettingsForm);

class EditSettingsDialog extends Component {
  static propTypes = {
    settings: PropTypes.object,
    onClose: PropTypes.func,
    updateData: PropTypes.func
  };

  onUpdateFields = changedFields => {
    const { settings, updateData } = this.props;
    if (changedFields !== settings) {
      console.log({
        ...settings,
        ...changedFields
      });
      updateData({
        ...settings,
        ...changedFields
      });
    }
  };

  render() {
    const { settings, onClose } = this.props;
    return (
      <div className="LoadDataDialog">
        <WrappedEditSettingsForm
          onClose={onClose}
          settings={settings}
          onChange={this.onUpdateFields}
        />
      </div>
    );
  }
}

export default EditSettingsDialog;
