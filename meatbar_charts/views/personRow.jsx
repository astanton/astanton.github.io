import React from 'react';

class PersonRow extends React.Component {

  	render() {
	    return <tr onClick={this.props.onClick} className={this.props.isSelected ? 'selected' : ''}>
			  		<td>{this.props.name}</td>
			  		<td>{this.props.count}</td>
			  	</tr>
	  }
}

module.exports = PersonRow
