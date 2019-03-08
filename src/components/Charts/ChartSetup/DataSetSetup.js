import React, { Component, Fragment } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import AddIcon from "@material-ui/icons/Add";
import Delete from "@material-ui/icons/Delete";
import Settings from "@material-ui/icons/Settings";

import { Typography } from "@material-ui/core";

const colors = [
  {
    description: "Czarny",
    color: "black"
  },
  {
    description: "Niebieski",
    color: "blue"
  },
  {
    description: "Ciemnoniebieski",
    color: "darkblue"
  },
  {
    description: "Czerwony",
    color: "red"
  }
];

const pickerStyles = {
  block: {
    width: "16px",
    height: "16px",
    marginRight: "8px",
    display: "inline-block",
    verticalAlign: "middle"
  }
};

const ColorPicker = withStyles(pickerStyles)(({ classes, ...props }) => (
  <Select {...props}>
    {colors.map((color, key) => (
      <MenuItem value={color.color} key={key}>
        <div
          style={{
            backgroundColor: color.color
          }}
          className={classes.block}
        />
        {color.description}
      </MenuItem>
    ))}
  </Select>
));

const styles = {
  removeButton: {
    textAlign: "center",
    paddingTop: "12px"
  },
  gridCell: {
    padding: "4px 8px"
  },
  select: {
    width: "100%"
  },
  textField: {
    width: "100%"
  },
  extentionPanel: {
    boxShadow: "none",
    "&:before": {
      display: "none"
    },
    backgroundColor: "inherit"
  },
  extentionPanelDetails: {
    padding: "4px 0px",
    "&::after": {
      content: '""',
      border: "10px solid transparent",
      borderTop: "10px solid #9fa8da",
      position: "relative",
      top: "-4px",
      right: "95px"
    }
  },
  grid: {
    flexGrow: 1
  }
};

const DataSetSetupInput = ({
  xs = 6,
  classes,
  dataSet,
  field,
  onChange,
  ...props
}) => (
  <Grid item xs={xs} className={classes.gridCell}>
    <TextField
      value={dataSet[field.key]}
      label={field.label}
      InputLabelProps={{
        shrink: true
      }}
      onChange={onChange}
      name={field.key}
      margin="none"
      {...props}
    />
  </Grid>
);

const DataSetSetupSelect = ({
  xs = 6,
  classes,
  error,
  dataSet,
  field,
  SelectComponent,
  selectItems,
  onChange,
  ...props
}) => (
  <Grid item xs={xs} className={classes.gridCell}>
    <FormControl className={classes.select} error={error}>
      <InputLabel shrink>{field.label}</InputLabel>
      {SelectComponent ? (
        <SelectComponent
          value={dataSet[field.key]}
          onChange={onChange}
          name={field.key}
          {...props}
        />
      ) : (
        <Select value={dataSet[field.key]} onChange={onChange} name={field.key}>
          {selectItems.map((item, id) => {
            const { value, description, ...props } = item;
            return (
              <MenuItem key={id} value={value} {...props}>
                {description}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </FormControl>
  </Grid>
);

const parsePath = path => {
  const sliced = path.split(".");
  return sliced.length > 0 ? sliced[sliced.length - 1] : "";
};

const parseIntToRange = (value, min, max) => {
  let val = parseInt(value, 10);
  val = max && val > max ? max : val;
  return min && val < min ? min : val;
};

class DataSetItemSetup extends Component {
  static propTypes = {
    dataSources: PropTypes.object,
    dataSet: PropTypes.shape({
      setPath: PropTypes.string,
      axis: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      description: PropTypes.string,
      width: PropTypes.number,
      color: PropTypes.string,
      dashed: PropTypes.bool,
      dashLength: PropTypes.number,
      dashSpacing: PropTypes.number
    }).isRequired,
    removeSet: PropTypes.func.isRequired,
    updateSet: PropTypes.func.isRequired
  };

  state = {
    expanded: false
  };

  fields = {
    path: {
      key: "path",
      label: "Zestaw danych"
    },
    axis: {
      key: "axis",
      label: "Oś odniesienia"
    },
    description: {
      key: "description",
      label: "Opis danych",
      formatter: value => value.substr(0, 30)
    },
    width: {
      key: "width",
      label: "Grubość linii",
      formatter: value => parseIntToRange(value, 1, 5)
    },
    color: {
      key: "color",
      label: "Kolor linii"
    },
    dashed: {
      key: "dashed",
      label: "Przerywana linia"
    },
    dashLength: {
      key: "dashLength",
      label: "Długość kreski",
      formatter: value => parseIntToRange(value, 4, 15)
    },
    dashSpacing: {
      key: "dashSpacing",
      label: "Długość przerwy",
      formatter: value => parseIntToRange(value, 4, 15)
    }
  };

  handleExpand = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  };

  handleChange = event => {
    this.props.updateSet({
      [event.target.name]: ((formatter, value) =>
        formatter ? formatter(value) : value)(
        this.fields[event.target.name].formatter,
        event.target.value
      )
    });
  };

  handleChangeSet = event => {
    const update = {
      [event.target.name]: ((formatter, value) =>
        formatter ? formatter(value) : value)(
        this.fields[event.target.name].formatter,
        event.target.value
      ),
      [this.fields.description.key]: parsePath(event.target.value)
    };
    this.props.updateSet(update);
  };

  handleChangeDashed = (event, checked) => {
    this.props.updateSet({
      [event.target.name]: checked
    });
  };

  hasValidPath = () => {
    const { dataSet } = this.props;
    const path = dataSet[this.fields.path.key];
    return path && path !== "";
  };

  pathItems = () => {
    const result = [];
    const onlySet = Object.keys(this.props.dataSources).length === 2;
    Object.keys(this.props.dataSources).forEach(key => {
      if (onlySet) {
        result.push({
          value: key,
          description: `Zestaw danych - ${key}`,
          disabled: true
        });
      }
      result.push(
        ...Object.keys(this.props.dataSources[key]).map(key2 => ({
          value: `${key}.${key2}`,
          description: key2
        }))
      );
    });
    return result;
  };

  render() {
    const { dataSet, removeSet, classes } = this.props;
    const isValid = this.hasValidPath();
    return (
      <div className="DataSet">
        <div className={"Header" + (this.state.expanded ? " Expanded" : "")}>
          <Grid container alignItems="center" justify="center">
            <DataSetSetupSelect
              error={!isValid}
              xs={8}
              dataSet={dataSet}
              classes={classes}
              field={this.fields.path}
              onChange={this.handleChangeSet}
              selectItems={this.pathItems()}
            />
            <Grid item xs={2} className={classes.removeButton}>
              {isValid && (
                <Tooltip title="Ustawienia">
                  <IconButton
                    onClick={this.handleExpand}
                    color={this.state.expanded ? "primary" : "default"}
                  >
                    <Settings />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={2} className={classes.removeButton}>
              <Tooltip title="Usuń dane">
                <IconButton onClick={removeSet}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
        <div>
          {isValid && (
            <div>
              <ExpansionPanel
                className={classes.extentionPanel}
                expanded={this.state.expanded}
              >
                <ExpansionPanelDetails
                  className={classes.extentionPanelDetails}
                >
                  <div className={classes.grid}>
                    <Grid container>
                      <DataSetSetupInput
                        dataSet={dataSet}
                        classes={classes}
                        field={this.fields.description}
                        onChange={this.handleChange}
                        className={classes.textField}
                      />
                      <DataSetSetupSelect
                        xs={6}
                        dataSet={dataSet}
                        classes={classes}
                        field={this.fields.axis}
                        onChange={this.handleChange}
                        selectItems={[{ value: 1, description: "Oś nr 1" }]}
                      />
                      <DataSetSetupInput
                        dataSet={dataSet}
                        classes={classes}
                        field={this.fields.width}
                        onChange={this.handleChange}
                        className={classes.textField}
                        type="number"
                      />
                      <DataSetSetupSelect
                        xs={6}
                        dataSet={dataSet}
                        classes={classes}
                        field={this.fields.color}
                        onChange={this.handleChange}
                        SelectComponent={ColorPicker}
                      />
                      <Grid item xs={12} className={classes.gridCell}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              checked={dataSet.dashed}
                              onChange={this.handleChangeDashed}
                              name="dashed"
                            />
                          }
                          label="Linia przerywana"
                        />
                      </Grid>
                      {dataSet.dashed && (
                        <Fragment>
                          <DataSetSetupInput
                            dataSet={dataSet}
                            classes={classes}
                            field={this.fields.dashLength}
                            onChange={this.handleChange}
                            className={classes.textField}
                            type="number"
                          />
                          <DataSetSetupInput
                            dataSet={dataSet}
                            classes={classes}
                            field={this.fields.dashSpacing}
                            onChange={this.handleChange}
                            className={classes.textField}
                            type="number"
                          />
                        </Fragment>
                      )}
                    </Grid>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const StyledDataSetItemSetup = withStyles(styles)(DataSetItemSetup);

const defaultDataSetSetup = {
  path: "",
  axis: 1,
  description: "",
  width: 1,
  color: "black",
  dashed: false,
  dashLength: 5,
  dashSpacing: 5
};

const testDataSource = {
  pomiar1: {
    temperature: {},
    wilgotnosc: {}
  },
  pomiar2: {
    co2: {},
    "predkosc wiatru": {}
  }
};

class DataSetSetup extends Component {
  state = {
    values: []
  };

  addValue = () => {
    this.setState(prevState => ({
      values: [...prevState.values, Object.assign({}, defaultDataSetSetup)]
    }));
  };

  removeValue = id => {
    this.setState(prevState => ({
      values: [...prevState.values].filter((e, i) => i !== id)
    }));
  };

  updateValue = (id, newValue) => {
    this.setState(prevState => {
      const values = [...prevState.values];
      Object.assign(values[id], newValue);
      return {
        values
      };
    });
  };

  render() {
    const { values } = this.state;
    return (
      <div className="SetupSection">
        <div>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={10}>
              <Typography variant="h6">
                {`Dane prezentowane na wykresie${(items =>
                  items > 0 ? ` (${items})` : "")(this.state.values.length)}`}
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: "center" }}>
              <Tooltip title="Dodaj zestaw do wykresu">
                <Fab
                  size="small"
                  color="primary"
                  aria-label="Add"
                  onClick={this.addValue}
                  disabled={this.state.values.length > 7}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
        {values.length > 0 && (
          <div className="DataSetContainer">
            {values.map((e, i) => (
              <StyledDataSetItemSetup
                dataSources={testDataSource}
                removeSet={() => this.removeValue(i)}
                key={i}
                dataSet={e}
                updateSet={newValue => {
                  this.updateValue(i, newValue);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default DataSetSetup;
