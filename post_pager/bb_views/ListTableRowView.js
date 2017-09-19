var ListTableRowView = SOCIView.extend({

	template: _.template($('#ListTableRowView').text()),

	tagName: 'tr',

	className: 'ListTableRowView table-row',

	events: {
		'click' : 'onRowClicked',
		'click button.delete' : 'onDeleteClicked'
	},

	initialize: function(options) {
		this.collection = options.collection;
    this.listItem = options.listItem;
		SOCIView.prototype.initialize.call(this, options);
	},

	onRowClicked: function(event) {
		var listItemDetailsView = new ListItemDetailsView({
			listItem: this.listItem
		});
		listItemDetailsView.showDetails();
	},

	onDeleteClicked: function(event) {
		event.stopPropagation();
		this.collection.remove(this.listItem.id);
	},

	render: function() {
		this.$el.html(this.template({
			id: this.listItem.id,
			message: this.listItem.getMessage(),
			schedule: this.listItem.getSchedule(),
			network: this.listItem.getNetwork(),
			status: this.listItem.getStatus()
		}));
		return this;
	}

});
