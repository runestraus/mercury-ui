// Copyright 2017 Donuts Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tldData: {};
  tldOptions: {};
  domainsData: {};
  domainsOptions: {};
  resVsPremData: {};
  resVsPremOptions: {};
  priceCatData: {};
  priceCatOptions: {};
  tldNames: string[];

  constructor() { }

  ngOnInit() {
    this.tldOptions = {
      title: {
        display: true,
        text: 'Domains registered by TLD',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };

    this.tldData = {
      labels: ['.pizza', '.cow', '.example', '.donuts', '.city', '.fun',
      '.cookie', '.movie', '.wtf', '.游戏', '.salad', '.dough', '.example'],
      datasets: [
        {
          data: [300, 50, 100, 56, 25, 49, 30, 277, 128, 39, 89, 160, 80],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#F5B7B1',
            '#42A5F5',
            '#6C3483',
            '#7CB342',
            '#4bc0c0',
            '#27AE60',
            '#CCD1D1',
            '#F4D03F',
            '#D2B4DE',
            '#EC7063'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#F5B7B1',
            '#42A5F5',
            '#6C3483',
            '#7CB342',
            '#4bc0c0',
            '#27AE60',
            '#CCD1D1',
            '#F4D03F',
            '#D2B4DE',
            '#EC7063'
          ]
        }]
    };

    this.domainsData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: '2016',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: '2017',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.domainsOptions = {
      title: {
        display: true,
        text: 'Domains registered',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };

    this.resVsPremData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Reserved Names',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4bc0c0'
        },
        {
          label: 'Premium Names',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#565656'
        }
      ]
    };

    this.resVsPremOptions = {
      title: {
        display: true,
        text: 'Reserved names vs Premium names registration',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };

    this.priceCatData = {
      datasets: [{
        data: [
          20,
          40,
          22.99,
          43.76,
          2.23,
          120.00,
          99.00,
          66.00,
          10.00,
          33.00,
          50.00
        ],
        backgroundColor: [
          '#FF6384',
          '#4BC0C0',
          '#FFCE56',
          '#E7E9ED',
          '#36A2EB',
          '#1E88E5',
          '#42A5F5',
          '#4bc0c0',
          '#EC7063',
          '#D2B4DE',
          '#F4D03F'
        ],
        label: 'Price Categories'
      }],
      labels: [
        'A',
        'A+',
        'AA+',
        'AAA+',
        'B',
        'BB',
        'BBBB',
        'BBB+',
        'B+',
        'BB+',
        'C'
      ]
    };

    this.priceCatOptions = {
      title: {
        display: true,
        text: 'Price Categories',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };
  }
}
