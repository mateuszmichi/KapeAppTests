import React, { Component, Fragment } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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

import Language from "@material-ui/icons/Language";
import Description from "@material-ui/icons/Description";

import { Typography } from "@material-ui/core";

const dataSources = {
  database: {
    description: "Baza danych",
    icon: <Language />,
    component: null
  },
  userinput: {
    description: "Wgraj dane",
    icon: <Description />,
    component: null
  }
};

const periods = {
  day: {
    description: "Dzienne"
  },
  week: {
    description: "Tygodniowe"
  },
  month: {
    description: "Miesięczne"
  },
  quarter: {
    description: "Kwartalne"
  },
  halfYear: {
    description: "Połoworoczne"
  },
  year: {
    description: "Roczne"
  },
  userDefined: {
    description: "Niestandardowe"
  }
};

const customTabStyle = {
  root: {
    width: 160
  }
};

const CustomTab = withStyles(customTabStyle)(({ classes, ...props }) => (
  <Tab className={classes.root} {...props} />
));

class DateRangePicker extends Component {
  static propTypes = {
    mode: PropTypes.string,
    settings: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state =
      props.mode === "edit"
        ? props.settings
        : {
            name: "",
            source: "database",
            period: ""
          };
  }
}

class DataSetItemSetup extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.string,
    settings: PropTypes.object
  };
  static defaultProps = {
    mode: "create"
  };

  constructor(props) {
    super(props);
    this.state =
      props.mode === "edit"
        ? props.settings
        : {
            name: "",
            source: "database",
            period: ""
          };
  }

  handleSourceChange = (event, value) => {
    this.setState({
      source: value
    });
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { open } = this.props;
    const { source, name } = this.state;
    return (
      <Dialog open={open} onClose={this.handleClose}>
        <div className="LoadDataDialog">
          <TextField
            value={name}
            label="Nazwa zestawu danych"
            InputLabelProps={{
              shrink: true
            }}
            onChange={this.handleChange}
            name="name"
            margin="none"
            error={!name || name === ""}
            // {...props}
          />
          <Tabs
            value={source}
            onChange={this.handleSourceChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <CustomTab disabled label="Wybierz źródło danych" />
            {Object.keys(dataSources).map(e => (
              <CustomTab
                value={e}
                label={dataSources[e].description}
                key={e}
                icon={dataSources[e].icon}
              />
            ))}
          </Tabs>
          <div>{source}</div>
        </div>
      </Dialog>
    );
  }
}

export default DataSetItemSetup;
