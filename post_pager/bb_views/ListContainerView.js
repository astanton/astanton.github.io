var ListContainerView = SOCIView.extend({

	template: _.template($('#ListContainerView').text()),

	className: 'ListContainerView',

	initialize: function(options) {
		this.collection = options.collection;
		SOCIView.prototype.initialize.call(this, options);
	},

	render: function() {
		this.$el.html(this.template());

		this.$summary = this.$el.find('.summary');
		this.$header = this.$el.find('.header');
		this.$table = this.$el.find('.table');

		this.renderSummary();
		this.renderHeader();
		this.renderTable();

		return this;
	},

	renderSummary: function() {
		this.listSummaryView = new ListSummaryView({
			collection: this.collection
		});
		this.$summary.append(this.listSummaryView.render().$el);
	},

	renderHeader: function() {
		this.listHeaderView = new ListHeaderView({
			collection: this.collection
		});
		this.$header.append(this.listHeaderView.render().$el);
	},

	renderTable: function() {
		this.listTableView = new ListTableView({
			collection: this.collection
		});
		this.$table.append(this.listTableView.render().$el);
	},

	remove: function() {
		this.listSummaryView.remove();
		this.listHeaderView.remove();
		this.listTableView.remove();

		SOCIView.prototype.remove.call(this);
	}

});
