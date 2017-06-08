import api from './api.js';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import styles from './css/styles.css'

import PersonTable from './views/personTable.jsx';
import ConsumptionChart from './views/consumptionChart.jsx';

import React from 'react';
import ReactDOM from 'react-dom';

class App {

  	async init() {
      try{
          this.consumptions = (await api.getConsumptions()).data;
          this.peopleConsumptionMap = this.buildPeopleConsumptionMap()
          this.selectedPerson = _.keys(this.peopleConsumptionMap)[0];
      }
      catch (error) {
        this.consumptions = [];
        this.selectedPerson = undefined;
        this.peopleConsumptionMap = {};
      }

      this.renderContent();
  	};

    renderContent() {

      // this is simulating the error case up above - if it fails
      // we want to render the error down below
      if (this.selectedPerson !== undefined) {

        ReactDOM.render(
          <PersonTable
            peopleConsumptionMap={this.peopleConsumptionMap}
            selectedPerson={this.selectedPerson}
            handleRowClick={_.bind(this.handleRowClick, this)}
          />,
          document.getElementById('person-table-content'));

      	ReactDOM.render(
          <ConsumptionChart
            selectedPerson={this.selectedPerson}
            selectedPersonMap={this.peopleConsumptionMap[this.selectedPerson]}
          />,
          document.getElementById('consumption-chart'));
      }
      else {
        ReactDOM.render(
          <div className="alert alert-danger">
            Error loading data...
          </div>,
          document.getElementById('main-content'));
      }
    };

    handleRowClick(event, nameClicked) {
  		this.selectedPerson = nameClicked;
      this.renderContent();
  	};

    buildPeopleConsumptionMap() {
      let peopleConsumptionMap = {};

      this.consumptions.map(consumption => {
        if (peopleConsumptionMap[consumption.name] === undefined) {
          peopleConsumptionMap[consumption.name] = {};
          peopleConsumptionMap[consumption.name].count = 0;
        }

        let personMap = peopleConsumptionMap[consumption.name];
        personMap.count++;

        if (personMap.barTypes === undefined) {
          personMap.barTypes = {};
        }

        if (personMap.barTypes[consumption.barType] === undefined) {
          personMap.barTypes[consumption.barType] = 0;
        }
        personMap.barTypes[consumption.barType]++;
      });

      return peopleConsumptionMap;
    };
}

const app = new App();
window.addEventListener('load', () => app.init());
