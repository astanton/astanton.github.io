var ListItemDetailsView = SOCIView.extend({

	template: _.template($('#ListItemDetailsView').text()),

	className: 'ListItemDetailsView',

  events: {
    'click .modal, button.close' : 'remove',
    'click .details' : 'onDetailsClicked'
  },

	initialize: function(options) {
    this.listItem = options.listItem;
		SOCIView.prototype.initialize.call(this, options);
	},

  // have to catch click here so it doesn't go through to modal
  onDetailsClicked: function(event) {
    event.stopPropagation();
  },

	render: function() {
		this.$el.html(this.template({
			author: this.listItem.getCreatedByName(),
			createdAt: this.listItem.getCreatedAt(),
			scheduledFor: this.listItem.getSchedule(),
			network: this.listItem.getNetwork(),
			networkThumb: this.listItem.getNetworkThumb(),
			networkName: this.listItem.getNetworkName(),
			status: this.listItem.getStatus(),
			message: this.listItem.getMessage()
    }));
		return this;
	},

  showDetails: function() {
    $('body').append(this.render().$el);
  },

});
