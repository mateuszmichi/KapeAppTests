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
import CircularProgress from "@material-ui/core/CircularProgress";

import CloudDownload from "@material-ui/icons/CloudDownload";
import Delete from "@material-ui/icons/Delete";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import CheckIcon from "@material-ui/icons/Check";
import ErrorOutline from "@material-ui/icons/ErrorOutline";

import { Typography } from "@material-ui/core";

import LoadDataDialog from "./LoadDataDialog";

const styles = {
  removeButton: {
    textAlign: "center",
    paddingTop: "12px"
  },
  centerButton: {
    textAlign: "center",
    padding: "4px 8px"
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

class SetDisplay extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.shape({
      dateFrom: PropTypes.object,
      dateTo: PropTypes.object,
      dataSets: PropTypes.array
    })
  };

  render() {
    const { name, status, classes } = this.props;
    return (
      <div className="DataSet">
        <div>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={6} className={classes.gridCell}>
              <Typography variant="subheading">{name}</Typography>
            </Grid>
            <Grid item xs={2} className={classes.centerButton}>
              <Tooltip
                title={
                  {
                    downloaded: "Pobrano dane",
                    failed: "Wystąpił błąd",
                    loading: "Oczekuję..."
                  }[status]
                }
              >
                {
                  {
                    downloaded: <CheckIcon />,
                    failed: <ErrorOutline />,
                    loading: <CircularProgress size={32} />
                  }[status]
                }
              </Tooltip>
            </Grid>
            <Grid item xs={2} className={classes.centerButton}>
              <Tooltip title="Szczegóły">
                <IconButton>
                  <InfoOutlined />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={2} className={classes.centerButton}>
              <Tooltip title="Usuń dane">
                <IconButton>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const StyledSetDisplay = withStyles(styles)(SetDisplay);

class SetsSetup extends Component {
  state = {
    openDialog: false,
    sets: [
      {
        name: "Parter",
        status: "downloaded"
      },
      {
        name: "Pierwsze piętro",
        status: "loading"
      },
      {
        name: "Piwnica",
        status: "failed"
      }
    ]
  };

  addSet = () => {
    this.setState({
      openDialog: true
    });
  };

  handleCloseDialog = () => {
    this.setState({
      openDialog: false
    });
  };

  render() {
    const { sets } = this.state;
    return (
      <div className="SetupSection">
        <div>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={10}>
              <Typography variant="h6">
                {`Dane pomiarowe${(items => (items > 0 ? ` (${items})` : ""))(
                  sets.length
                )}`}
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: "center" }}>
              <Tooltip title="Pobierz zestaw danych">
                <Fab
                  size="small"
                  color="primary"
                  aria-label="Add"
                  onClick={this.addSet}
                  disabled={sets.length > 7}
                >
                  <CloudDownload />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
        {sets.length > 0 && (
          <div className="DataSetContainer">
            {sets.map((e, i) => (
              <StyledSetDisplay
                key={i}
                name={e.name}
                status={e.status}
                description={e.description}
              />
            ))}
          </div>
        )}
        <LoadDataDialog
          open={this.state.openDialog}
          onClose={this.handleCloseDialog}
        />
      </div>
    );
  }
}

export default SetsSetup;
