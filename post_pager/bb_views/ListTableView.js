var ListTableView = SOCIView.extend({

	template: _.template($('#ListTableView').text()),

	className: 'ListTableView',

	events: {
		'click button.prev' : 'onPrevButtonClicked',
		'click button.next' : 'onNextButtonClicked'
	},

	PAGE_SIZE: 5,

	initialize: function(options) {
    this.collection = options.collection;
		this.currentPage = 0;
		this.listenTo(this.collection, 'remove change', this.render);
		this.listenTo(this.collection, 'search', this.newSearch);

		SOCIView.prototype.initialize.call(this, options);
	},

	onPrevButtonClicked: function(event) {
		this.currentPage--;
		this.render();
	},

	onNextButtonClicked: function(event) {
		this.currentPage++;
		this.render();
	},

	checkIfDeletedLastItem: function() {
		if (this.filteredCollection.length/this.PAGE_SIZE === this.currentPage && this.currentPage !== 0) {
			this.currentPage--;
		}
	},

	// on new search, go back to the first page
	newSearch: function() {
		this.currentPage = 0;
		this.render();
	},

	render: function() {
		this.$el.html(this.template());

		this.filteredCollection = this.collection.getFilteredCollection();
		this.filteredCollection.sort();

		// in the instance that we deleted the last item on the last page,
		// we want to go back to the previous page
		this.checkIfDeletedLastItem();

		this.renderTableRows();
		this.initializeNavButtons();
		return this;
	},

	renderTableRows: function() {
		this.listTableRowViews = [];

		var offset = this.currentPage * this.PAGE_SIZE;
		for (var a = offset; a < offset + this.PAGE_SIZE && a < this.filteredCollection.length; a++) {

			var listItem = this.filteredCollection.at(a);
			var listTableRowView = new ListTableRowView({
				collection: this.collection,
				listItem: listItem
			});

			this.listTableRowViews.push(listTableRowView);
			this.$el.find('#table-data').append(listTableRowView.render().$el);
		};
	},

	initializeNavButtons: function() {
		this.$el.find('button.prev').prop('disabled', this.currentPage === 0);
		this.$el.find('button.next').prop('disabled', this.PAGE_SIZE * (this.currentPage + 1) >= this.filteredCollection.length);
	},

	remove: function() {
		_.each(this.listTableRowViews, function(listTableRowView) {
			listTableRowView.remove();
		});
		SOCIView.prototype.remove.call(this);
	}

});
