import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import PDFGeneration from "./components/PDFGeneration";
import ChartCreate from "./components/ChartCreate/ChartCreate";

import { LocaleProvider } from "antd";
import pl_PL from "antd/lib/locale-provider/pl_PL";
import moment from "moment";
import "moment/locale/pl";
moment.locale("pl");

const styles = {
  root: {
    flexDirection: "row"
  },
  menuTab: {
    maxWidth: "240px",
    textDecoration: "unset"
  },
  button: {
    width: "100%",
    height: "100%",
    color: "white",
    padding: "4px 16px"
  }
};

const TestContent = ({ link, description, component }) => (
  <Route key={link} path={`/${link}/`} component={component} />
);

const TestList = [
  {
    link: "pdf-generation",
    description: "Generacja PDF",
    component: PDFGeneration
  },
  {
    link: "recharts",
    description: "Technologia tworzenia wykresów",
    component: ChartCreate
  },
  {
    link: "indicators",
    description: "Operacje na wskaźnikach",
    component: Test
  }
];

function Test() {
  return <h1>Test</h1>;
}

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <LocaleProvider locale={pl_PL}>
        <Router>
          <div className="App">
            <AppBar position="static" className={classes.root}>
              {TestList.map(e => (
                <Link to={e.link} key={e.link} className={classes.menuTab}>
                  <Button className={classes.button}>{e.description}</Button>
                </Link>
              ))}
            </AppBar>
            <div className="TestField">{TestList.map(e => TestContent(e))}</div>
          </div>
        </Router>
      </LocaleProvider>
    );
  }
}

export default withStyles(styles)(App);
