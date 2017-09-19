var ListSummaryView = SOCIView.extend({

	template: _.template($('#ListSummaryView').text()),

	className: 'ListSummaryView',

	initialize: function(options) {
    this.collection = options.collection;
    this.listenTo(this.collection, 'remove', this.render);

		SOCIView.prototype.initialize.call(this, options);
	},

  updateCounts: function() {
		this.approvedPostCount = 0;
		this.pendingPostCount = 0;
		this.rejectedPostCount = 0;

	  _.each(this.collection.models, _.bind(function(listItem) {
			this.approvedPostCount += listItem.isApproved() ? 1 : 0;
			this.pendingPostCount += listItem.isPending() ? 1 : 0;
			this.rejectedPostCount += listItem.isRejected() ? 1 : 0;
		}, this));
	},

	render: function() {
		this.updateCounts();
    this.$el.html(this.template({
			totalListItemsCount: this.collection.length,
			approvedPostCount: this.approvedPostCount,
			pendingPostCount: this.pendingPostCount,
			rejectedPostCount: this.rejectedPostCount
		}));

		return this;
	}

});
