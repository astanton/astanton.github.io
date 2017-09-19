var ListHeaderView = SOCIView.extend({

	template: _.template($('#ListHeaderView').text()),

	className: 'ListHeaderView',

  events: {
    'change select.sorter' : 'onSorterChanged',
    'change select.direction' : 'onDirectionChanged',
    'click button.search-button' : 'onSearchClicked'
  },

	initialize: function(options) {
    this.collection = options.collection;
		SOCIView.prototype.initialize.call(this, options);
	},

  onSorterChanged: function(event) {
    var sortValue = $(event.currentTarget).val();
    this.collection.sortValue = sortValue;
    this.collection.trigger('change');
  },

  onDirectionChanged: function(event) {
    var sortDirection = $(event.currentTarget).val();
    this.collection.sortDirection = sortDirection;
    this.collection.trigger('change');
  },

  onSearchClicked: function(event) {
    var val = this.$searchInput.val();
    this.collection.filterValue = val;
    this.collection.trigger('search');
  },

	render: function() {
		this.$el.html(this.template({}));
    this.$searchInput = this.$el.find('.text-search');
		return this;
	}

});
