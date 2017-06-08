import React from 'react';
import { Chart } from 'react-google-charts';
import _ from 'lodash'

class ConsumptionChart extends React.Component {

  	render() {

      let chartOptions = {
        legend: {
          position: "top"
        }
      };

      let pieChartData = [
        ['Bar Type', 'Count']
      ];
      _.each(_.keys(this.props.selectedPersonMap.barTypes), _.bind(function(key) {
        pieChartData.push([key, this.props.selectedPersonMap.barTypes[key]]);
      }, this));

	    return (
        <div className="section">
          <div className="header">
            Meat consumed by {this.props.selectedPerson}
          </div>
          <div id="graph-content" className="content">
            <Chart
              chartType="PieChart"
              data={pieChartData}
              options={chartOptions}
              graph_id="pie-chart"
              width="100%"
              height="500px"
              legend="legend_toggle"
            />
          </div>
        </div>
      )
	  }
}

module.exports = ConsumptionChart
