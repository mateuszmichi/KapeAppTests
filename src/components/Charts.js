import React, { Component } from 'react';
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Label } from 'recharts'

import TestDataGenerator from '../generators/TestDataGenerator'

const data = TestDataGenerator()

class Charts extends Component {
    render() {
      return (
        <div>
          <h1>Wykres z dwoma różnymi jednostkami</h1>
          <LineChart width={500} height={300} data={data}>
            <Line type="monotone" dataKey="outside_temperature" dot={false} yAxisId={'temperature'} stroke="#347812"/>
            <Line type="monotone" dataKey="inside_temperature" dot={false} yAxisId={'temperature'} stroke="#347812"/>
            <Line type="monotone" dataKey="hot_water" dot={false} yAxisId={'water'} stroke="#1212ff"/>
            <XAxis dataKey="time"/>
            <YAxis yAxisId={'temperature'} stroke="#347812">
              <Label value="Temperatura [oC]" offset={0} position='insideLeft' style={{}}/>
            </YAxis>
            <YAxis yAxisId={'water'} orientation="right" stroke="#1212ff">
              <Label value="Zużycie wody" offset={0} angle={-90} position='insideRight' />
            </YAxis>
            <CartesianGrid/>
          </LineChart>
        </div>
      );
    }
  }
  
  export default Charts;