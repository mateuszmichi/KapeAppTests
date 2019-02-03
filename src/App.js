import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from "react-router-dom";
import Charts from './components/Charts'

import TestDataGenerator from './generators/TestDataGenerator'

console.log(TestDataGenerator());

const TestLink = ({link, description, component}) => (
  <Link to={link}>{description}</Link>
);

const TestContent = ({link, description, component}) => (
  <Route path={`/${link}/`} component={component} />
);

const TestList = [
  {link:"pdf-generation", description:"Generacja PDF", component: Test},
  {link:"recharts", description:"Technologia tworzenia wykresów", component: Charts},
  {link:"indicators", description:"Operacje na wskaźnikach", component: Test},
];

function Test(){
  return <h1>Test</h1>
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="Menu">
            <ul>
              {TestList.map((e)=><li>{TestLink(e)}</li>)}
            </ul>
          </div>
          <div className="TestField">
            {TestList.map((e)=>TestContent(e))}
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
