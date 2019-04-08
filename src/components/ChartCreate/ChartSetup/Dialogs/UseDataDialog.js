import React, { Component } from "react";
import PropTypes from "prop-types";
import { head } from "lodash";
// imported elements
import ColorSelect from "../../../Common/ColorSelect";
import VisibilitySwitch from "../../../Common/VisibilitySwitch";
// ant.design
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  TreeSelect,
  Button,
  Select
} from "antd";
const { Option } = Select;

// TODO zastosowac MODES

class PathSelect extends Component {
  static propTypes = {
    loadedData: PropTypes.object.isRequired
  };

  genTreeData = () => {
    const data = this.props.loadedData;
    return Object.keys(data).map(e => ({
      title: data[e].fields.description.value,
      value: `${e}`,
      selectable: false,
      key: `${e}`,
      children: data[e].loadedKeys.map(set => ({
        title: `${data[e].fields.description.value}: ${set.description}`,
        value: `${e}-${set.key}`,
        key: `${e}-${set.key}`
      }))
    }));
  };
  render() {
    return (
      <TreeSelect
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        treeData={this.genTreeData()}
        placeholder="Wybierz załadowane dane"
        treeDefaultExpandAll
        {...this.props}
      />
    );
  }
}

class AxisSelect extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
      })
    )
  };
  render() {
    const { data } = this.props;
    return (
      <Select {...this.props}>
        {data.map(({ id, description }) => (
          <Option key={id} value={id}>
            {description}
          </Option>
        ))}
      </Select>
    );
  }
}

class UseDataForm extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["edit", "load"]).isRequired,
    editedData: PropTypes.object,
    loadedData: PropTypes.object,
    onClose: PropTypes.func,
    loadData: PropTypes.func,
    config: PropTypes.object.isRequired,
    updateData: PropTypes.func
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (this.props.mode === "edit") {
        this.props.onClose();
      } else {
        this.props.loadData({
          fields: Object.keys(fieldsValue).reduce(
            (prev, field) => ({
              ...prev,
              [field]: {
                value: fieldsValue[field]
              }
            }),
            {}
          )
        });
        this.handleReset();
        this.props.onClose();
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleAxisData = () => {
    const { config } = this.props;
    console.log("handleAxisData", this.props);
    const axisData = Object.keys(config.yAxises).map(key => ({
      id: key,
      description: config.yAxises[key].description.value
    }));
    return {
      axisData,
      defaultAxisData: axisData[0].id
    };
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const isEdit = this.props.mode === "edit";
    const { axisData, defaultAxisData } = this.handleAxisData();
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
          <Form.Item label="Opis danych">
            {getFieldDecorator("description", {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  message: "Proszę podać opis zestawu"
                },
                {
                  message: "Wymagana nazwa o długości od 3 do 30 znaków",
                  whitespace: true,
                  min: 3,
                  max: 30
                }
              ]
            })(<Input placeholder="Nazwa zestawu danych" />)}
          </Form.Item>
          <Form.Item label="Wybór danych">
            {getFieldDecorator("dataSource", {
              rules: [
                {
                  required: true,
                  message: "Proszę wybrać załadowane dane"
                }
              ]
            })(<PathSelect loadedData={this.props.loadedData} />)}
          </Form.Item>
          <Form.Item label="Oś odniesienia">
            {getFieldDecorator("axis", {
              validateTrigger: ["onChange"],
              rules: [
                {
                  required: true,
                  message: "Wybierz rodzaj zakresu czasu"
                }
              ],
              initialValue: defaultAxisData
            })(<AxisSelect data={axisData} />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("showRegresion", {
              initialValue: false,
              valuePropName: "checked"
            })(<Checkbox>Pokaż linię regresji</Checkbox>)}
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Grubość linii">
                {getFieldDecorator("lineWidth", {
                  initialValue: 2,
                  rules: [
                    {
                      required: true,
                      type: "number",
                      min: 1,
                      max: 6,
                      message: "Wybierz liczbę z zakresu od 1 do 6"
                    }
                  ]
                })(
                  <InputNumber
                    className="AutoInputNumber"
                    min={1}
                    max={6}
                    step={1}
                    precision={0}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kolor linii">
                {getFieldDecorator("lineColor", {
                  initialValue: "black",
                  rules: [
                    {
                      required: true,
                      message: "Wybierz kolor linii"
                    }
                  ]
                })(<ColorSelect />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            {getFieldDecorator("dashed", {
              initialValue: false,
              valuePropName: "checked"
            })(<Checkbox>Użyj przerywanej linii</Checkbox>)}
          </Form.Item>
          <VisibilitySwitch visible={getFieldValue("dashed")}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Długość kreski">
                  {getFieldDecorator("dashLength", {
                    initialValue: 5,
                    rules: [
                      {
                        required: true,
                        type: "number",
                        min: 4,
                        max: 15,
                        message: "Wybierz liczbę z zakresu od 4 do 15"
                      }
                    ]
                  })(
                    <InputNumber
                      className="AutoInputNumber"
                      min={4}
                      max={15}
                      step={1}
                      precision={0}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Długość przerwy">
                  {getFieldDecorator("dashSpacing", {
                    initialValue: 5,
                    rules: [
                      {
                        required: true,
                        type: "number",
                        min: 4,
                        max: 15,
                        message: "Wybierz liczbę z zakresu od 4 do 15"
                      }
                    ]
                  })(
                    <InputNumber
                      className="AutoInputNumber"
                      min={4}
                      max={15}
                      step={1}
                      precision={0}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </VisibilitySwitch>
        </div>
        <div className="LoadDataDialogSubmit">
          {!isEdit && (
            <Button onClick={this.handleReset} style={{ marginRight: 16 }}>
              Zresetuj
            </Button>
          )}
          <Button
            type="primary"
            icon={isEdit ? "redo" : "plus"}
            htmlType="submit"
          >
            {isEdit ? "Aktualizuj" : "Dodaj dane"}
          </Button>
        </div>
      </Form>
    );
  }
}

const updateValidationRules = {
  description: [value => value.length >= 3, value => value.length <= 30],
  lineWidth: [value => value >= 1, value => value <= 6],
  dashLength: [value => value >= 4, value => value <= 15],
  dashSpacing: [value => value >= 4, value => value <= 15]
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

const WrappedUseDataForm = Form.create({ name: "use_data_form" })(UseDataForm);
const WrappedEditUseDataForm = Form.create({
  name: "edit_use_data_form",
  onFieldsChange: (props, changedFields) => {
    if (!validateFields(changedFields)) {
      return console.warn("Form not valid, abort update");
    }
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return Object.keys(props.editedData).reduce(
      (prev, key) => ({
        ...prev,
        [key]: Form.createFormField({ ...props.editedData[key] })
      }),
      {}
    );
  }
})(UseDataForm);

class UseDataDialog extends Component {
  static propTypes = {
    mode: PropTypes.string,
    editedData: PropTypes.object,
    loadedData: PropTypes.object,
    config: PropTypes.object,
    onClose: PropTypes.func,
    loadData: PropTypes.func,
    updateData: PropTypes.func
  };

  onUpdateFields = changedFields => {
    // TODO validacja - przez async wymaga recznego napisania
    const { editedData, updateData } = this.props;
    if (changedFields !== editedData.fields) {
      console.log({
        ...editedData,
        fields: { ...editedData.fields, ...changedFields }
      });
      updateData({
        ...editedData,
        fields: { ...editedData.fields, ...changedFields }
      });
    }
  };

  render() {
    const {
      mode,
      editedData,
      loadedData,
      onClose,
      loadData,
      config,
      updateData
    } = this.props;
    return (
      <div className="LoadDataDialog">
        {mode === "edit" ? (
          <WrappedEditUseDataForm
            mode="edit"
            onClose={onClose}
            updateData={updateData}
            editedData={editedData.fields}
            loadedData={loadedData}
            config={config}
            onChange={this.onUpdateFields}
          />
        ) : (
          <WrappedUseDataForm
            mode="load"
            onClose={onClose}
            config={config}
            loadData={loadData}
            loadedData={loadedData}
          />
        )}
      </div>
    );
  }
}

export default UseDataDialog;
