import React from 'react';
import PersonRow from './personRow.jsx';
import _ from 'lodash';

class PersonTable extends React.Component {

	constructor(props) {
		super(props);
		this.peopleConsumptionMap = props.peopleConsumptionMap;
	};

	render() {

	  	let list = [];
	  	_.each(_.keys(this.peopleConsumptionMap), _.bind(function(key) {
	  		let value = this.peopleConsumptionMap[key];
	  		list.push(<PersonRow key={value.count.toString()} isSelected={key === this.props.selectedPerson} name={key} count={value.count} onClick={(e) => this.props.handleRowClick(e, key)}/>)
	  	}, this));

	    return (
	    	<table className="table table-hover person-table">
			  			<thead>
				  			<tr>
				  				<th>Name</th>
				  				<th>Consumptions</th>
				  			</tr>
			  			</thead>
			  			<tbody id="person-table-body">
			  				{list}
			  			</tbody>
			  		</table>
		);
	}
}

module.exports = PersonTable
