/* 
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-03-30    
 */
import React, { Component } from 'react';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';
import ReactDOM from 'react-dom';
import { Bar } from '@ant-design/plots';


  const data = [
    {
      type: '分类一',
      values: [76, 100],
    },
    {
      type: '分类二',
      values: [56, 108],
    },
    {
      type: '分类三',
      values: [38, 129],
    },
    {
      type: '分类四',
      values: [58, 155],
    },
    {
      type: '分类五',
      values: [45, 120],
    },
    {
      type: '分类六',
      values: [23, 99],
    },
    {
      type: '分类七',
      values: [18, 56],
    },
    {
      type: '分类八',
      values: [18, 34],
    },
  ];
  const config = {
    data: data.reverse(),
    xField: 'values',
    yField: 'type',
    isRange: true,
    label: {
      position: 'middle',
      layout: [
        {
          type: 'adjust-color',
        },
      ],
    },
  };

export default class Todo extends Component {
  render() {
    return (
      <div>
        <CustomBreadcrumb primaryHeading="todo" secondaryHeading="todohome" />
        Todo
        <Bar {...config} />
      </div>
    );
  }
}



// import { Scatter } from '@antv/g2plot';

// fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/scatter.json')
//   .then((res) => res.json())
//   .then((data) => {
//     const plot = new Scatter('container', {
//       data,
//       xField: 'weight',
//       yField: 'height',
//       colorField: 'gender',
//       size: 5,
//       shape: 'circle',
//       pointStyle: {
//         fillOpacity: 1,
//       },
//       brush: {
//         enabled: true,
//         mask: {
//           style: {
//             fill: 'rgba(255,0,0,0.15)',
//           },
//         },
//       },
//     });
//     plot.render();
//   });