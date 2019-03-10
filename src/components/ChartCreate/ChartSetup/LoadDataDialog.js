import React, { Component, PureComponent } from "react";
import moment from "moment";
import { filter } from "lodash";
import PropTypes from "prop-types";
// imported elements
import TestDataGenerator, {
  RandomSerie
} from "../../../generators/TestDataGenerator";
import Upload from "../../Common/Upload";
// ant.design
import {
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Tabs,
  Icon,
  Button,
  Select,
  DatePicker,
  message
} from "antd";
const { Option } = Select;
const { TabPane } = Tabs;
const { WeekPicker, MonthPicker, RangePicker } = DatePicker;

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const filterOutAll = array => filter(array, e => e !== "all");

const filterOnlyDoneFiles = array => filter(array, e => e.status === "done");

const isDateAfter = date => moment().isBefore(date);

const periods = {
  day: {
    description: "Dzienne",
    default: moment().subtract(1, "day"),
    label: "Wybór dnia",
    name: "date-picker",
    rules: [{ required: true, message: "Wybierz wartość", type: "object" }],
    element: ({ ...props }) => (
      <DatePicker disabledDate={isDateAfter} {...props} />
    ),
    formatter: value => ({
      from: value.startOf("day").format(),
      to: value.endOf("day").format()
    })
  },
  week: {
    description: "Tygodniowe",
    default: moment().subtract(1, "week"),
    label: "Wybór tygodnia",
    name: "week-picker",
    rules: [{ required: true, message: "Wybierz wartość", type: "object" }],
    element: ({ ...props }) => (
      <WeekPicker
        disabledDate={isDateAfter}
        format="WW. [tydzień] YYYY"
        {...props}
      />
    ),
    formatter: value => ({
      from: value.startOf("week").format(),
      to: value.endOf("week").format()
    })
  },
  month: {
    description: "Miesięczne",
    default: moment().subtract(1, "month"),
    label: "Wybór miesiąca",
    name: "month-picker",
    rules: [{ required: true, message: "Wybierz wartość", type: "object" }],
    element: ({ ...props }) => (
      <MonthPicker disabledDate={isDateAfter} {...props} />
    ),
    formatter: value => ({
      from: value.startOf("month").format(),
      to: value.endOf("month").format()
    })
  },
  userDefined: {
    description: "Inny zakres",
    default: [moment().subtract(1, "months"), moment()],
    label: "Wybór zakresu dni",
    name: "range-picker",
    rules: [{ required: true, message: "Wybierz wartość", type: "array" }],
    element: ({ ...props }) => (
      <RangePicker disabledDate={isDateAfter} {...props} />
    ),
    formatter: values => ({
      from: values[0].startOf("day").format(),
      to: values[0].endOf("day").format()
    })
  }
};

class PeriodSelect extends Component {
  render() {
    return (
      <Select placeholder="Rodzaj zakresu danych" {...this.props}>
        {Object.keys(periods).map(e => (
          <Option key={e} value={e}>
            {periods[e].description}
          </Option>
        ))}
      </Select>
    );
  }
}

class PossibleDataCheckBox extends Component {
  render() {
    const { possibleData, ...props } = this.props;
    return (
      <Checkbox.Group style={{ width: "100%" }} {...props}>
        <Row>
          <Col span={24}>
            <Checkbox value="all">Wybierz wszystkie</Checkbox>
          </Col>
        </Row>
        <Row>
          {possibleData.map(e => (
            <Col key={e.key} span={8}>
              <Checkbox value={e.key}>{e.description}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    );
  }
}

class CustomUpload extends Component {
  render() {
    const { onChange, disabled } = this.props;
    return (
      <Upload.Dragger
        // can add validator={(file) => validatefileresult: boolean}
        accept=".txt,.csv,.xls,.xlsx"
        name="files"
        onChange={onChange}
        disabled={disabled}
      >
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">Kliknij lub przeciągnij plik z danymi</p>
        <p className="ant-upload-hint">
          Wspiera przesłanie pojedynczego pliku.
        </p>
      </Upload.Dragger>
    );
  }
}

class LoadedFiles extends PureComponent {
  render() {
    const { fileList } = this.props;
    return (
      <Upload
        showUploadList={{ showRemoveIcon: false }}
        defaultFileList={fileList.fileList}
        disabled={true}
      />
    );
  }
}

class LoadDataForm extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["edit", "load"]).isRequired,
    editedData: PropTypes.object,
    possibleData: PropTypes.array,
    onClose: PropTypes.func,
    loadData: PropTypes.func,
    updateData: PropTypes.func
  };

  state = {
    possibleData: this.props.possibleData || [],
    uploadedFiles: 0
  };

  onUploadChange = info => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} - Plik został załadowany poprawnie`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} - Nie udało się załadować pliku.`);
    }
    this.setState({
      uploadedFiles: filterOnlyDoneFiles(info.fileList)
    });
  };

  changeDataSource = source => {
    this.props.form.setFieldsValue({
      dataSource: source
    });
  };

  // TODO aktualnie zaslepka na strzal
  loadDataFromApi = async fields => {
    await timeout(2000);
    const Generator = {};
    fields.measurements.forEach(e => {
      Generator[e] = () => RandomSerie({});
    });
    return TestDataGenerator(Generator);
  };

  getFieldsFromFlow = () => {
    const requiredFields = [];
    const formattedFields = [];
    requiredFields.push("description");
    requiredFields.push("dataSource");
    if (this.props.form.getFieldValue("dataSource") === "db") {
      const currentPeriodValue = this.props.form.getFieldValue("selectPeriod");
      requiredFields.push("selectPeriod");
      requiredFields.push(periods[currentPeriodValue].name);
      formattedFields.push({
        name: periods[currentPeriodValue].name,
        formatter: periods[currentPeriodValue].formatter
      });
      requiredFields.push("measurements");
      formattedFields.push({
        name: "measurements",
        formatter: filterOutAll
      });
    } else {
      requiredFields.push("dropbox");
      formattedFields.push({
        name: "dropbox",
        formatter: value => filterOnlyDoneFiles(value.fileList)
      });
      requiredFields.push("saveOnDB");
      formattedFields.push({
        name: "saveOnDB",
        formatter: value => Boolean(value)
      });
    }
    return { requiredFields, formattedFields };
  };

  getRequiredFields = requiredFields =>
    requiredFields.reduce(
      (prev, field) => ({
        ...prev,
        [field]: { value: this.props.form.getFieldValue(field) }
      }),
      {}
    );

  handleSubmit = async e => {
    e.preventDefault();

    const { requiredFields, formattedFields } = this.getFieldsFromFlow();

    this.props.form.validateFields(
      requiredFields,
      {},
      async (err, fieldsValue) => {
        if (err) {
          return;
        }
        const statusFieldsValue = { ...fieldsValue };
        formattedFields.forEach(e => {
          fieldsValue[e.name] = e.formatter(fieldsValue[e.name]);
        });
        if (this.props.mode === "edit") {
          // TODO strzal
        } else {
          const data =
            statusFieldsValue["dataSource"] === "db"
              ? await this.loadDataFromApi(fieldsValue)
              : {};
          this.props.loadData({
            fields: this.getRequiredFields(requiredFields),
            data,
            possibleData: this.state.possibleData
          });
        }
        this.handleReset();
        this.props.onClose();
        return;
      }
    );
  };

  // TODO: fetch/mock
  loadPossibleData = async () => {
    await timeout(1000);
    const result = [
      {
        key: "temperature",
        description: "Temperatura"
      },
      {
        key: "co2",
        description: "CO2"
      },
      {
        key: "humidity",
        description: "Wilgotność"
      }
    ];
    this.setState({
      possibleData: result,
      checkedList: ["all", ...result.map(e => e.key)]
    });
  };

  componentDidMount() {
    console.log("did mount", this.props, this.state);
    if (this.props.mode === "load") {
      this.loadPossibleData();
    }
  }

  normalizeCheckBox = (value, prevValue = []) => {
    if (!value) return [];
    if (value.indexOf("all") >= 0 && prevValue.indexOf("all") < 0) {
      return ["all", ...this.state.possibleData.map(e => e.key)];
    }
    if (value.indexOf("all") < 0 && prevValue.indexOf("all") >= 0) {
      return [];
    }
    const filtered = filterOutAll(value);
    if (filtered.length !== this.state.possibleData.length) {
      return filtered;
    } else {
      return ["all", ...this.state.possibleData.map(e => e.key)];
    }
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const initialPeriodValue = "month";
    const currentPeriodValue =
      getFieldValue("selectPeriod") || initialPeriodValue;
    const isEdit = this.props.mode === "edit";
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
          <Form.Item label="Nazwa zestawu">
            {getFieldDecorator("description", {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  message: "Proszę podać nazwę zestawu"
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
          <Form.Item label="Źródło danych">
            {getFieldDecorator("dataSource", {
              valuePropName: "activeKey",
              initialValue: "db"
            })(
              <Tabs onChange={this.changeDataSource}>
                <TabPane
                  tab={
                    <span>
                      <Icon type="database" />
                      Pobierz z bazy danych
                    </span>
                  }
                  key="db"
                  disabled={isEdit && getFieldValue("dataSource") !== "db"}
                >
                  <Form.Item label="Rodzaj zakresu danych">
                    {getFieldDecorator("selectPeriod", {
                      validateTrigger: ["onChange"],
                      rules: [
                        {
                          required: true,
                          message: "Wybierz rodzaj zakresu czasu"
                        }
                      ],
                      initialValue: initialPeriodValue
                    })(<PeriodSelect disabled={isEdit} />)}
                  </Form.Item>
                  <Form.Item label={periods[currentPeriodValue].label}>
                    {getFieldDecorator(periods[currentPeriodValue].name, {
                      validateTrigger: ["onChange"],
                      rules: periods[currentPeriodValue].rules,
                      initialValue: periods[currentPeriodValue].default
                    })(
                      periods[currentPeriodValue].element({
                        disabled: isEdit
                      })
                    )}
                  </Form.Item>
                  {this.state.possibleData.length > 0 && (
                    <Form.Item label="Pobierane pomiary">
                      {getFieldDecorator("measurements", {
                        initialValue: this.state.checkedList,
                        normalize: this.normalizeCheckBox,
                        rules: [
                          {
                            validator: (rule, value, callback) =>
                              filterOutAll(value).length === 0
                                ? callback(rule.message)
                                : callback(),
                            message:
                              "Potrzebny minimum jeden pomiar do pobrania"
                          }
                        ]
                      })(
                        <PossibleDataCheckBox
                          possibleData={this.state.possibleData}
                        />
                      )}
                    </Form.Item>
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <Icon type="upload" />
                      Wgraj z pliku
                    </span>
                  }
                  key="file"
                  disabled={isEdit && getFieldValue("dataSource") !== "file"}
                >
                  <Form.Item label="Wczytaj plik">
                    <div className="dropbox">
                      {getFieldDecorator("dropbox", {
                        valuePropName: "fileList",
                        getValueFromEvent: this.normFile,
                        rules: [
                          {
                            validator: (rule, value, callback) =>
                              filterOnlyDoneFiles(value ? value.fileList : [])
                                .length !== 1
                                ? callback(rule.message)
                                : callback(),
                            message: "Potrzebny poprawny plik do załadowania"
                          }
                        ]
                      })(
                        isEdit ? (
                          <LoadedFiles />
                        ) : (
                          <CustomUpload
                            onChange={this.onUploadChange}
                            disabled={this.state.uploadedFiles > 0}
                          />
                        )
                      )}
                    </div>
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator("saveOnDB", {
                      valuePropName: "checked"
                    })(<Checkbox>Zapisz w bazie danych</Checkbox>)}
                  </Form.Item>
                </TabPane>
              </Tabs>
            )}
          </Form.Item>
        </div>
        <div className="LoadDataDialogSubmit">
          <Button onClick={this.handleReset} style={{ marginRight: 16 }}>
            Zresetuj
          </Button>
          <Button
            type="primary"
            icon="plus"
            htmlType="submit"
            disabled={!(this.state.possibleData.length > 0)}
          >
            Dodaj dane
          </Button>
        </div>
      </Form>
    );
  }
}

const WrappedLoadDataForm = Form.create({ name: "load_data_form" })(
  LoadDataForm
);
const WrappedEditDataForm = Form.create({
  name: "edit_data_form",
  onFieldsChange(props, changedFields) {
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
})(LoadDataForm);

class LoadDataDialog extends Component {
  static propTypes = {
    mode: PropTypes.string,
    editedData: PropTypes.object,
    onClose: PropTypes.func,
    loadData: PropTypes.func,
    updateData: PropTypes.func
  };

  onUpdateFields = changedFields => {
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
    const { mode, editedData, onClose, loadData, updateData } = this.props;

    return (
      <div className="LoadDataDialog">
        {mode === "edit" ? (
          <WrappedEditDataForm
            mode="edit"
            onClose={onClose}
            updateData={updateData}
            editedData={editedData.fields}
            possibleData={editedData.possibleData}
            onChange={this.onUpdateFields}
          />
        ) : (
          <WrappedLoadDataForm
            mode="load"
            onClose={onClose}
            loadData={loadData}
          />
        )}
      </div>
    );
  }
}

export default LoadDataDialog;
