import React, { Component } from 'react';
import { LineChart, XAxis, YAxis, Line } from 'recharts'

import TestDataGenerator from '../generators/TestDataGenerator'

const data = TestDataGenerator()

class Charts extends Component {
    render() {
      return (
        <LineChart width={500} height={300} data={data}>
          <Line type="monotone" dataKey="outside_temperature" dot={false} yAxisId={'temperature'}/>
          <Line type="monotone" dataKey="inside_temperature" dot={false} yAxisId={'temperature'}/>
          {/* <Line type="monotone" dataKey="hot_water" dot={false} yAxisId={'water'}/>
          <Line type="monotone" dataKey="electricity" dot={false} yAxisId={'power'}/> */}
          <XAxis dataKey="time"/>
          <YAxis yAxisId={'temperature'}/>
          {/* <YAxis yAxisId={'water'}/>
          <YAxis yAxisId={'power'}/> */}
        </LineChart>
      );
    }
  }
  
  export default Charts;