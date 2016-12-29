define([], function() {

	function Chart(data) {

		this.data = data || {};

		this.init();
	}

	Chart.prototype = {

		chart: null,

		data: {},

		container: '#application-quiz-chart',

		getOptions: function() {
			return {
				labelInterpolationFnc: function(value) {
					return value[0]
				}
			};
		},

		getResponsiveOptions: function() {

			return [
				['screen and (min-width: 640px)', {
					chartPadding: 30,
					labelOffset: 100,
					labelDirection: 'explode',
					labelInterpolationFnc: function(value) {
						return value;
					}
				}],
				['screen and (min-width: 1024px)', {
					labelOffset: 80,
					chartPadding: 20
				}]
			];
		},

		/**
		 * Initialize the chart display
		 *
		 * @return {[type]} [description]
		 */
		init: function() {

			this.chart = new Chartist.Pie(
				this.getContainer(),
				this.getData(),
				this.getOptions(),
				this.getResponsiveOptions()
			);
		},

		setData: function(data) {

			this.data = data || {};
			this.update();
		},

		getData: function() {

			return this.data;
		},

		getContainer: function() {

			return this.container;
		},

		/**
		 * Updates the chart display
		 *
		 * @return {[type]} [description]
		 */
		update: function() {

			this.chart.update(this.getData());
		},

	};

	return Chart;

});